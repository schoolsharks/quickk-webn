import mongoose, { Schema, model, Document } from 'mongoose';
import { generateTodayDate } from '../../../utils/generateTodayDate';
import { PulseType, Status } from '../types/enum';

// Define the Pulse interface
interface Pulse {
    refId: mongoose.Types.ObjectId;
    type: PulseType;
}


const today = generateTodayDate();

// Define the DailyPulse interface extending Mongoose Document
export interface IDailyPulse extends Document {
    publishOn: Date,
    pulses: Pulse[];
    stars: number;
    status: Status;
    company: mongoose.Types.ObjectId;
}

// Define the schema for DailyPulse
const DailyPulseSchema: Schema<IDailyPulse> = new Schema<IDailyPulse>({
    publishOn: {
        type: Date,
        default: today,
    },
    stars: {
        type: Number,
        default: 0,
    },
    pulses: [
        {
            refId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            type: {
                type: String,
                enum: Object.values(PulseType),
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: Object.values(Status),
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
});

// Create the model
const DailyPulse = model<IDailyPulse>('DailyPulse', DailyPulseSchema);

export default DailyPulse;