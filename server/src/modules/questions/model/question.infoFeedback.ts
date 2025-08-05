import { Schema, model, Document } from 'mongoose';
import { FeedbackType } from '../types/enum';


interface IQuestionInfoFeedback extends Document {
    user: Schema.Types.ObjectId;
    feedback: FeedbackType;
    infoCard: Schema.Types.ObjectId;
}

const QuestionInfoFeedbackSchema = new Schema<IQuestionInfoFeedback>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    feedback: {
        type: String,
        enum: Object.values(FeedbackType),
        required: true,
    },
    infoCard: {
        type: Schema.Types.ObjectId,
        ref: 'InfoCard',
        required: true,
    },
});

const QuestionInfoFeedback = model<IQuestionInfoFeedback>('QuestionInfoFeedback', QuestionInfoFeedbackSchema);

export default QuestionInfoFeedback;