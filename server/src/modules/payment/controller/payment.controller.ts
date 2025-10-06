import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import paymentService from "../service/payment.service";
import AppError from "../../../utils/appError";
import { PaymentPurpose } from "../types/interfaces";

class PaymentController {
  /**
   * Create a new payment order
   * POST /api/v1/payment/create-order
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const { amount, currency = "INR", purpose } = req.body;

      // Validate input
      if (!amount || !purpose) {
        throw new AppError(
          "Amount and purpose are required",
          StatusCodes.BAD_REQUEST
        );
      }

      // Validate purpose
      if (!Object.values(PaymentPurpose).includes(purpose)) {
        throw new AppError("Invalid payment purpose", StatusCodes.BAD_REQUEST);
      }

      // For listing purpose, amount should be 399
      if (purpose === PaymentPurpose.LISTING && amount !== 399) {
        throw new AppError(
          "Listing fee is ₹399 only",
          StatusCodes.BAD_REQUEST
        );
      }

      const order = await paymentService.createOrder({
        amount,
        currency,
        purpose,
        userId,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify payment after successful payment
   * POST /api/v1/payment/verify
   */
  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;

      // Validate input
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new AppError(
          "Missing payment verification details",
          StatusCodes.BAD_REQUEST
        );
      }

      const result = await paymentService.verifyPayment(
        {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
        userId
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: result.message,
        data: result.payment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Razorpay webhook
   * POST /api/v1/payment/webhook
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;

      if (!signature) {
        throw new AppError(
          "Missing webhook signature",
          StatusCodes.BAD_REQUEST
        );
      }

      const payload = req.body;

      const result = await paymentService.handleWebhook(payload, signature);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment history for authenticated user
   * GET /api/v1/payment/history
   */
  async getPaymentHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const { purpose } = req.query;

      const payments = await paymentService.getPaymentHistory(
        userId,
        purpose as PaymentPurpose
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by ID
   * GET /api/v1/payment/:id
   */
  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
      }

      const { id } = req.params;

      const payment = await paymentService.getPaymentById(id, userId);

      res.status(StatusCodes.OK).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
