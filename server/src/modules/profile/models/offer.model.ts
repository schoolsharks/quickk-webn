import mongoose, { Schema } from 'mongoose';
import { IOffer } from '../types/interfaces';


const offerSchema: Schema<IOffer> = new Schema<IOffer>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  partner: { type: String, required: true },
  partnerLogo: { type: String },
  discountValue: { type: Number, required: true },
  minimumPurchase: { type: Number },
  validDays: [{ type: String }],
  pointsRequired: { type: Number, required: true },
  unlockLevel: { type: Number },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;