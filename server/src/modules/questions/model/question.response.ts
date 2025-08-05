import { Schema, model, Document } from 'mongoose';

export interface IQuestionResponse extends Document {
    user: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    response: string | string[];
    starsAwarded?: number;
}

const QuestionResponseSchema = new Schema<IQuestionResponse>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    response: {
        type: [String],
        required: true,
        // Accepts either a string or an array of strings
        validate: {
            validator: function (v: any) {
                return typeof v === 'string' || (Array.isArray(v) && v.every(item => typeof item === 'string'));
            },
            message: 'Response must be a string or an array of strings',
        },
    },
    starsAwarded: {
        type: Number,
        default: 0,
    },
});

const QuestionResponse = model<IQuestionResponse>('QuestionResponse', QuestionResponseSchema);

export default QuestionResponse;