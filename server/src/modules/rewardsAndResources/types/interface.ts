import mongoose from "mongoose";
import { RewardTypes, ResourceStatus, ResourceType } from "./enums";

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
  _id?: mongoose.Types.ObjectId;
  image: string;
  heading: string;
  subHeading: string;
  stars: number;
  companyName: string;
  companyEmail?: string;
  companyContact?: string;
  companyLogo?: string;
  status: ResourceStatus;
  type: ResourceType;
  targetAudience: string[];
  quantity: number;
  expiryDate: Date;
  description: {
    title: string;
    points: string[];
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
