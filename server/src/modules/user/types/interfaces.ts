import mongoose, { Schema } from "mongoose";

export interface IUser {
  companyMail: string;
  name: string;
  company: Schema.Types.ObjectId;
  avatar: Schema.Types.ObjectId;
  avatarSelected: boolean;
  address?: string;
  contact?: string;

  time?: number;
  totalStars: number;
  redeemedStars: number;
  learningStreak: number;
  lastLearningActivity: Date;
  level: number;

  // webn specific fields
  chapter?: string;
  businessName?: string;
  businessLogo?: string;
  instagram?: string;
  facebook?: string;
  specialisation?: string;
  businessCategory?: string;
  designation?: string;
  currentStage?: string;
  communityGoal?: string;
  interestedEvents?: string;
  webnClubMember?: boolean;
  referredBy?: mongoose.Types.ObjectId;
  listed?: boolean;
}

export interface IAvatar {
  src: string;
}

export enum ConnectionPlatform {
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  MAIL = 'mail'
}

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface IUserConnection {
  userId: Schema.Types.ObjectId;
  connectionId: Schema.Types.ObjectId;
  platforms: ConnectionPlatform[];
  status?: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddConnectionRequest {
  connectionId: string;
  platform: ConnectionPlatform;
}

export interface IConnectionResponse {
  _id: string;
  userId: string;
  connectionId: string;
  platforms: ConnectionPlatform[];
  createdAt: Date;
  updatedAt: Date;
}
