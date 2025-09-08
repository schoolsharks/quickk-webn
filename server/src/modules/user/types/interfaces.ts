import { Schema } from 'mongoose';


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
    instagram?: string;
    facebook?: string;
    specialisation?: string;
    businessCategory?: string;
    designation?: string;
    currentStage?: string;
    communityGoal?: string;
    interestedEvents?: string;
    webnClubMember?: boolean;
}

export interface IAvatar {
    src: string;
}