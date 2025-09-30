import mongoose, { Schema } from "mongoose";
import { IUserConnection, ConnectionPlatform, ConnectionStatus } from "../types/interfaces";

const userConnectionSchema: Schema<IUserConnection> = new Schema<IUserConnection>(
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
    platforms: [{
      type: String,
      enum: Object.values(ConnectionPlatform),
      required: true,
    }],
    status: {
      type: String,
      enum: Object.values(ConnectionStatus),
      default: ConnectionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of user-connection pairs
userConnectionSchema.index({ userId: 1, connectionId: 1 }, { unique: true });

// Index for faster queries
userConnectionSchema.index({ userId: 1 });
userConnectionSchema.index({ connectionId: 1 });

const UserConnection = mongoose.model<IUserConnection>("UserConnection", userConnectionSchema);

export { UserConnection };