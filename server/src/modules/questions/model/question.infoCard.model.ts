import mongoose, { Schema } from 'mongoose';

export interface IInfoCard {
    title: string;
    content: string; 
    wantFeedback: boolean;
    score?: number;
}

const infoCardSchema: Schema<IInfoCard> = new Schema<IInfoCard>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    wantFeedback: { type: Boolean, required: true , default: false },
    score: { type: Number, default: 0 },
});

const InfoCard = mongoose.model('InfoCard', infoCardSchema);
export default InfoCard;