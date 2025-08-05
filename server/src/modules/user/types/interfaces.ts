import { Schema } from 'mongoose';


export interface IUser {
    companyMail: string;
    name: string;
    company: Schema.Types.ObjectId;
    avatar: Schema.Types.ObjectId;
    avatarSelected: boolean;
    address?: string;
    contact?: string;
    
    // New fields
    time?: number; // Assuming this is a duration in minutes
    totalStars: number;
    redeemedStars: number;
    learningStreak: number;
    lastLearningActivity: Date;
    level: number;
}

export interface IAvatar {
    src: string;
}