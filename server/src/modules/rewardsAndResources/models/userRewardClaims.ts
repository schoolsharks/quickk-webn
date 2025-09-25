import { Schema, model } from "mongoose";
import { IUserRewardsClaims } from "../types/interface";
import { RewardTypes } from "../types/enums";

<<<<<<< HEAD
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

// Create index for efficient queries
UserRewardsClaimsSchema.index({ user: 1, rewardType: 1 }, { 
  unique: true, 
  partialFilterExpression: { rewardType: { $ne: "RESOURCES" } } 
});
UserRewardsClaimsSchema.index({ user: 1, rewardType: 1, resourceId: 1 }, { 
  unique: true,
  partialFilterExpression: { rewardType: "RESOURCES" }
});
UserRewardsClaimsSchema.index({ createdAt: -1 });
=======


// Write a controller and service in theuserrewardclaims feature, it will and also route, take example of other features structuring, it should  be apply for reward, sending the type, and we will take the user from auth middleware, and then validate if it is in the RewardType or not, and if yes then we will create a document in userreward claims, and also it have to check if the current user has 1000 stars, if he dont have, then we will reject, and otherwise deduct 1000 stars from user, for that we need to use userservice, also 

// implement this thing
const UserRewardsClaimsSchema = new Schema<IUserRewardsClaims>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rewardType: {
    type: String,
    enum: Object.values(RewardTypes),
  },
});
>>>>>>> ce5b79d (rewards section)

const UserRewardsClaims = model<IUserRewardsClaims>(
  "UserRewardsClaims",
  UserRewardsClaimsSchema
);

export default UserRewardsClaims;
