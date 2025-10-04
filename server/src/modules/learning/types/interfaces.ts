import mongoose, { Types } from "mongoose";
import {
  CompletionStatus,
  Languages,
  ModuleType,
  ResourceType,
  Status,
} from "./enums";

export interface ICaption {
  startTime: number;
  endTime: number;
  text: string;
}

export interface IAudioContent {
  audioUrl: string;
  captions: ICaption[];
}

export interface Resource {
  name: string;
  url: string;
  type: ResourceType;
}

export interface ILearning extends Document {
  week?: number;
  title: string;
  modules: Types.ObjectId[];
  videoUrl?: string;
  status?: Status;
  validTill?: Date;
  publishOn?: Date;
  company: mongoose.Types.ObjectId;
  language: Languages;
}

export interface IModule extends Document {
  type: ModuleType;
  title: string;
  duration: string;
  completionStatus: CompletionStatus;
  assessment: Types.ObjectId[];
  flashcards: Types.ObjectId[]; // Add this
  content: string | Types.ObjectId[] | IAudioContent;
  resources?: Resource[];
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
