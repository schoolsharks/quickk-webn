import { QuestionProps } from "../../question/Types/types";

export interface ILearning {
    week: number;
    title: string;
    modules: string[];
}
export enum ModuleType {
    VIDEO = 'video',
    QUESTION = 'question',
}
export interface Module {
    type: ModuleType;
    assessment: String[];
    content: string | String[];
}

export interface VideoPlayerProps {
    videoUrl: string;
}

export interface ModuleProps {
    moduleId?: String;
    title?: string;
    isCompleted?: boolean;
    duration?: string;
    type?:string;
    assessment?: string[];
    isVideoWatched?: boolean;
    content?: string | string[];
}

export interface LearningProps {
    title: string;
    week: string;
    expanded?: boolean;
    items?: ModuleProps[];
    onToggle?: () => void;
}

export interface AssessmentProps {
    title:string;
    questions: QuestionProps[];
    moduleId: string;
}