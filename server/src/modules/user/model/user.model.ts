import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/interfaces";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    companyMail: { type: String, unique: true },
    name: { type: String },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "Avatar",
    },
    avatarSelected: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    contact: {
      type: String,
    },

    // New fields
    time: {
      type: Number,
      default: 0,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    redeemedStars: {
      type: Number,
      default: 0,
    },
    learningStreak: {
      type: Number,
      default: 0,
    },
    lastLearningActivity: {
      type: Date,
    },
    level: {
      type: Number,
      default: 1,
    },
    // webn specific fields
    chapter: {
      type: String,
    },
    businessName: {
      type: String,
    },
    businessLogo: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    specialisation: {
      type: String,
    },
    businessCategory: {
      type: String,
    },
    designation: {
      type: String,
    },
    currentStage: {
      type: String,
    },
    communityGoal: {
      type: String,
    },
    interestedEvents: {
      type: String,
    },
    webnClubMember: {
      type: Boolean,
      default: false,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.path('contact').validate((value: string) => {
//     return /^\d{10}$/.test(value); // Ensures the contact field is exactly 10 digits
// }, 'Contact number must be exactly 10 digits.');

const User = mongoose.model("User", userSchema);
export default User;
