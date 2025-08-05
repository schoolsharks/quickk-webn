import { Schema, model, Types } from 'mongoose';
import { ILearning } from '../types/interfaces';
import { Status } from '../types/enums';
// import { generateTodayDate } from '../../../utils/generateTodayDate';

// const today = generateTodayDate();

const LearningSchema = new Schema<ILearning>({
    week: {
        type: Number,
    },
    title: {
        type: String,
    },
    modules: [
        {
            type: Types.ObjectId,
            ref: 'Module',
        },
    ],
    status: {
        type: String,
        enum: Object.values(Status),
    },
    validTill: {
        type: Date,
        // default: today,
    },
    publishOn: {
        type: Date,
        // default: today,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },

});

const LearningModel = model<ILearning>('Learning', LearningSchema);

export default LearningModel;