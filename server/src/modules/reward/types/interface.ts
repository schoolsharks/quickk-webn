import mongoose, { Document } from "mongoose";
import { RewardStatus, TicketStatus } from "./enums";

export interface Reward extends Document {
    startTime: Date;
    endTime: Date;
    price: number;
    estimatedValue: number;
    status: RewardStatus;
    name: string;
    description: string;
    image: string;
    company: mongoose.Types.ObjectId;
}


export interface ITicket extends Document {
    status: TicketStatus;
    tokenNumber: number;
    ticketCode: string;
    reward: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
}