import mongoose from "mongoose";
import { RewardTypes } from "./enums";

export interface IUserRewardsClaims {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rewardType: RewardTypes;
  advertisementBannerUrl?: string;
  resourceId?: mongoose.Types.ObjectId;
  userInput?: string;
  advertised?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResources {
  image: string;
  heading: string;
  subHeading: string;
  stars: number;
  companyName:string;
  description: {
    title: string;
    points: string[];
  }[];
}
