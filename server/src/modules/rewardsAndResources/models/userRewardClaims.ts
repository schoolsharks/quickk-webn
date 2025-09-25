import { Schema, model } from "mongoose";
import { IUserRewardsClaims } from "../types/interface";
import { RewardTypes } from "../types/enums";



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

const UserRewardsClaims = model<IUserRewardsClaims>(
  "UserRewardsClaims",
  UserRewardsClaimsSchema
);

export default UserRewardsClaims;
