import mongoose from "mongoose";
import { RewardTypes } from "./enums";

export interface IUserRewardsClaims {
  user: mongoose.Types.ObjectId;
  rewardType: RewardTypes;
}
