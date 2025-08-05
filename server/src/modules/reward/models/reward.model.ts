import { Schema, model } from 'mongoose';
import { Reward } from '../types/interface';
import { RewardStatus } from '../types/enums';


const RewardSchema = new Schema<Reward>({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    estimatedValue: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(RewardStatus), required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
});

const Reward = model<Reward>('Reward', RewardSchema);

export default Reward;