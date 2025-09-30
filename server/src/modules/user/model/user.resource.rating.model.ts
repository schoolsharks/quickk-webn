import { Schema, model } from "mongoose";
import mongoose from "mongoose";

export enum ResourceRatingStatus {
  PENDING = "pending",
  RATED = "rated"
}

export interface IUserResourceRating {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resourceId: mongoose.Types.ObjectId;
  claimedAt: Date;
  status: ResourceRatingStatus;
  rating?: number; // 1-5 stars
  nextPulseAt: Date; // when to show next pulse
  expiresAt: Date; // 30 days expiry
  createdAt?: Date;
  updatedAt?: Date;
}

const UserResourceRatingSchema = new Schema<IUserResourceRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resources",
      required: true,
    },
    claimedAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ResourceRatingStatus),
      default: ResourceRatingStatus.PENDING,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    nextPulseAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
UserResourceRatingSchema.index({ userId: 1, status: 1 });
UserResourceRatingSchema.index({ nextPulseAt: 1, status: 1 });
UserResourceRatingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Compound index for ensuring one rating per user per resource
UserResourceRatingSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

const UserResourceRating = model<IUserResourceRating>("UserResourceRating", UserResourceRatingSchema);

export default UserResourceRating;