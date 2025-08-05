import mongoose, { Types } from "mongoose";
import { CompletionStatus, ModuleType, Status } from "./enums";

export interface ILearning extends Document {
    week?: number;
    title: string;
    modules: Types.ObjectId[];
    status?: Status;
    validTill?: Date;
    publishOn?: Date;
    company: mongoose.Types.ObjectId;
}

export interface IModule extends Document {
    type: ModuleType;
    title: string;
    duration: string;
    completionStatus: CompletionStatus;
    assessment: Types.ObjectId[];
    content: string | Types.ObjectId[];
}

export interface IUserModule extends Document {
    user: Types.ObjectId;
    module: Types.ObjectId;
    isCompleted: boolean;
}

export interface IUserVideo extends Document {
    user: Types.ObjectId;
    videoId: Types.ObjectId;
    isVideoWatched: boolean;
}