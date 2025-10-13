import { Schema, model } from "mongoose";
import { IUserRewardsClaims } from "../types/interface";
import { RewardTypes } from "../types/enums";

const UserRewardsClaimsSchema = new Schema<IUserRewardsClaims>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rewardType: {
      type: String,
      enum: Object.values(RewardTypes),
      required: true,
    },
    advertisementBannerUrl: {
      type: String,
      required: false,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resources",
      required: false,
    },
    userInput: {
      type: String,
      required: false,
    },
    advertised: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserRewardsClaims = model<IUserRewardsClaims>(
  "UserRewardsClaims",
  UserRewardsClaimsSchema
);

export default UserRewardsClaims;
