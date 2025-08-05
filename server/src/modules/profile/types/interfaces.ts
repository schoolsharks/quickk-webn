import  { Schema } from 'mongoose';


export interface IBadge {
    name: string;
    description?: string;
    imageUrl?: string;
    criteria: string; // Description of how to earn the badge
    progressRequired: number; // Total progress needed to complete the badge (usually 100%)
  }

  export interface IUserBadge {
    user: Schema.Types.ObjectId;
    badge: Schema.Types.ObjectId;
    currentProgress: number; // Current progress percentage
    isCompleted: boolean;
    completedAt?: Date;
  }

  
  export interface ICertificate {
    title: string;
    description?: string;
    module: Schema.Types.ObjectId; // Reference to the learning module
  }
  

  export interface IUserCertificate {
    user: Schema.Types.ObjectId;
    certificate: Schema.Types.ObjectId;
    issueDate: Date;
    certificateId: string; // Unique ID for verification
  }
  
  export interface IOffer {
    title: string;
    description: string;
    partner: string; // e.g., "Amazon", "Starbucks"
    partnerLogo?: string;
    discountValue: number; // e.g., 20 for 20% off
    minimumPurchase?: number; // e.g., 2500 for orders above 2500Rs
    validDays?: string[]; // e.g., ["Wednesday"] for "10% off on Wednesdays"
    pointsRequired: number; // Points needed to unlock the offer
    unlockLevel?: number; // Optional level requirement to unlock
    expiryDate?: Date;
    isActive: boolean;
  }

  export interface IUserOffer {
    user: Schema.Types.ObjectId;
    offer: Schema.Types.ObjectId;
    redeemed: boolean;
    redeemedAt?: Date;
    isUnlocked: boolean;
  }
  