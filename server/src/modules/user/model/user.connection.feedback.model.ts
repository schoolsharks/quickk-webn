import mongoose, { Schema, Document } from "mongoose";

export enum ConnectionFeedbackStatus {
  PENDING = 'pending',
  RESPONDED = 'responded'
}

export interface IUserConnectionFeedback extends Document {
  userId: Schema.Types.ObjectId;
  connectionId: Schema.Types.ObjectId;
  userConnectionRef: Schema.Types.ObjectId; // Reference to UserConnection
  status: ConnectionFeedbackStatus;
  response?: 'yes' | 'no';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // Auto-expire after 24 hours if not responded
  nextPulseAt: Date; // When next pulse can be generated (6 hours from creation)
}

const userConnectionFeedbackSchema: Schema<IUserConnectionFeedback> = new Schema<IUserConnectionFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userConnectionRef: {
      type: Schema.Types.ObjectId,
      ref: "UserConnection",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ConnectionFeedbackStatus),
      default: ConnectionFeedbackStatus.PENDING,
    },
    response: {
      type: String,
      enum: ['yes', 'no'],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    nextPulseAt: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness and faster queries
userConnectionFeedbackSchema.index({ userId: 1, userConnectionRef: 1 }, { unique: true });
userConnectionFeedbackSchema.index({ userId: 1, status: 1 });
userConnectionFeedbackSchema.index({ nextPulseAt: 1, status: 1 });

const UserConnectionFeedback = mongoose.model<IUserConnectionFeedback>("UserConnectionFeedback", userConnectionFeedbackSchema);

export { UserConnectionFeedback };