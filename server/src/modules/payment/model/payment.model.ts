import mongoose, { Schema } from "mongoose";
import { IPayment, PaymentStatus, PaymentPurpose } from "../types/interfaces";

const paymentSchema: Schema<IPayment> = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.CREATED,
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: Object.values(PaymentPurpose),
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
paymentSchema.index({ userId: 1, purpose: 1, status: 1 });

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
