import { ModuleType } from "../../learning/types/enums";
import { OptionType, QuestionType } from "../../questions/types/enum";

export interface ModuleData {
    type?: ModuleType;
    title?: string;
    duration?: string;
    questionsCount?: number;
    assessmentCount?: number;
}

export interface GeminiQuestionResponse {
    qType: QuestionType;
    questionSubText?: string;
    questionSubHeading?: string;
    questionText: string;
    optionType?: OptionType;
    options: string[];
    correctAnswer: string | string[];
    questionOptions?: string[];
    score: number;
    explanation?: string;
    memoryPairs?: Array<{
        id: string;
        content: string;
        type: 'text' | 'image';
        matchId: string;
    }>;
}

export interface GeminiModuleResponse {
    contentQuestions?: GeminiQuestionResponse[];
    assessmentQuestions: GeminiQuestionResponse[];
    videoUrl?: string;
}

export interface ModuleCreationRequest {
    type?: ModuleType;
    title?: string;
    duration?: string;
    questionsCount?: number;
    assessmentCount?: number;
}


export interface DailyPulseData {
    pulseCount?: number;
    starsAwarded?: number;
    topic?: string;
}

export interface DailyPulseCreationRequest extends DailyPulseData {
    pulseCount: number;
    starsAwarded: number;
    topic: string;
}

export interface GeminiInfoCardResponse {
    title: string;
    content: string;
    wantFeedback: boolean;
    score?: number;
}


export interface GeminiDailyPulseResponse {
    infoCards: GeminiInfoCardResponse[];
    questions: GeminiQuestionResponse[];
}