import Razorpay from "razorpay";
import crypto from "crypto";
import { Types } from "mongoose";
import Payment from "../model/payment.model";
import User from "../../user/model/user.model";
import {
  CreateOrderData,
  VerifyPaymentData,
  PaymentStatus,
  PaymentPurpose,
  RazorpayWebhookPayload,
} from "../types/interfaces";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";

class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(data: CreateOrderData) {
    try {
      const { amount, currency, purpose, userId } = data;
      // Create order in Razorpay
      const options = {
        amount: amount * 100, // Amount in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          purpose,
          userId: userId.toString(),
        },
      };
      const razorpayOrder = await this.razorpay.orders.create(options);
      // Save payment record in database
      const payment = await Payment.create({
        userId,
        razorpayOrderId: razorpayOrder.id,
        amount,
        currency,
        status: PaymentStatus.CREATED,
        purpose,
        metadata: {
          receipt: razorpayOrder.receipt,
        },
      });
      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw new AppError(
        "Failed to create payment order",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPayment(data: VerifyPaymentData, userId: Types.ObjectId) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

      // Verify signature
      const isValid = this.verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        throw new AppError(
          "Invalid payment signature",
          StatusCodes.BAD_REQUEST
        );
      }

      // Find payment record
      const payment = await Payment.findOne({ razorpayOrderId });

      if (!payment) {
        throw new AppError("Payment record not found", StatusCodes.NOT_FOUND);
      }

      // Verify userId matches
      if (payment.userId.toString() !== userId.toString()) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      // Update payment record
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.status = PaymentStatus.CAPTURED;
      await payment.save();

      // Update user listing status if purpose is listing
      if (payment.purpose === PaymentPurpose.LISTING) {
        await this.updateUserListingStatus(userId, true);
      }

      return {
        success: true,
        message: "Payment verified successfully",
        payment: {
          id: payment._id,
          status: payment.status,
          purpose: payment.purpose,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error verifying payment:", error);
      throw new AppError(
        "Failed to verify payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Handle Razorpay webhook
   */
  async handleWebhook(payload: RazorpayWebhookPayload, signature: string) {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(
        JSON.stringify(payload),
        signature
      );

      if (!isValid) {
        throw new AppError(
          "Invalid webhook signature",
          StatusCodes.BAD_REQUEST
        );
      }

      const event = payload.event;
      const paymentEntity = payload.payload.payment.entity;

      // Find payment record
      const payment = await Payment.findOne({
        razorpayOrderId: paymentEntity.order_id,
      });

      if (!payment) {
        console.error("Payment record not found for webhook");
        return { success: false, message: "Payment record not found" };
      }

      // Handle different events
      switch (event) {
        case "payment.captured":
          payment.status = PaymentStatus.CAPTURED;
          payment.razorpayPaymentId = paymentEntity.id;
          await payment.save();

          // Update user listing status if purpose is listing
          if (payment.purpose === PaymentPurpose.LISTING) {
            await this.updateUserListingStatus(payment.userId, true);
          }
          break;

        case "payment.failed":
          payment.status = PaymentStatus.FAILED;
          payment.razorpayPaymentId = paymentEntity.id;
          payment.metadata = {
            ...payment.metadata,
            errorCode: paymentEntity.error_code,
            errorDescription: paymentEntity.error_description,
          };
          await payment.save();
          break;

        case "payment.authorized":
          payment.status = PaymentStatus.AUTHORIZED;
          payment.razorpayPaymentId = paymentEntity.id;
          await payment.save();
          break;

        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      return { success: true, message: "Webhook processed successfully" };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error handling webhook:", error);
      throw new AppError(
        "Failed to process webhook",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update user listing status
   */
  private async updateUserListingStatus(
    userId: Types.ObjectId,
    listed: boolean
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }

      user.listed = listed;
      await user.save();

      return user;
    } catch (error) {
      console.error("Error updating user listing status:", error);
      throw error;
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  private verifySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    return generated_signature === signature;
  }

  /**
   * Verify Razorpay webhook signature
   */
  private verifyWebhookSignature(body: string, signature: string): boolean {
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    return expected_signature === signature;
  }

  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: Types.ObjectId, purpose?: PaymentPurpose) {
    try {
      const query: any = { userId };
      if (purpose) {
        query.purpose = purpose;
      }

      const payments = await Payment.find(query)
        .sort({ createdAt: -1 })
        .select("-razorpaySignature");

      return payments;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw new AppError(
        "Failed to fetch payment history",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string, userId: Types.ObjectId) {
    try {
      const payment = await Payment.findOne({
        _id: paymentId,
        userId,
      }).select("-razorpaySignature");

      if (!payment) {
        throw new AppError("Payment not found", StatusCodes.NOT_FOUND);
      }

      return payment;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error fetching payment:", error);
      throw new AppError(
        "Failed to fetch payment",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new PaymentService();
