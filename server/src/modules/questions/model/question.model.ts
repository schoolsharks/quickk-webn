import mongoose, { Schema, model, Document } from 'mongoose';
import { OptionType, QuestionType } from "../types/enum";

export interface IQuestion extends Document {
    _id: mongoose.Types.ObjectId;
    qType: QuestionType;
    questionSubText?: string;//Exist at the top of the question
    questionSubHeading?: string;// Heading
    questionText: string;
    questionOptions?: string[];
    image?: string;
    optionType?: OptionType;
    options: string[];
    correctAnswer: string | string[];
    score?: number;
    explanation?: string;

    // NEW: memory pairs format
    memoryPairs?: Array<{
        id: string;
        content: string;
        type: 'text' | 'image';
        matchId: string;
    }>;
}

const QuestionSchema = new Schema<IQuestion>({
    qType: {
        type: String,
        enum: Object.values(QuestionType),
        required: true,
    },
    questionSubHeading: {
        type: String,
        default: null,
    },
    questionText: {
        type: String,
        required: true,
    },
    questionSubText: {
        type: String,
        default: null,
    },
    questionOptions: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        default: null,
    },
    optionType: {
        type: String,
        enum: Object.values(OptionType),
        default: null,
    },
    options: {
        type: [String],
        default: [],
    },
    correctAnswer: {
        type: Schema.Types.Mixed,
        required: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    explanation: {
        type: String,
    },
    memoryPairs: {
        type: [
            {
                id: { type: String, required: true },
                content: { type: String, required: true },
                type: { type: String, enum: ['text', 'image'], required: true },
                matchId: { type: String, required: true },
            }
        ],
        default: undefined,
    },
});

const Question = model<IQuestion>('Question', QuestionSchema);

export default Question;