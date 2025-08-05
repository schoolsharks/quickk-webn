import mongoose, { Schema } from 'mongoose';
import { IBadge } from '../types/interfaces';


const badgeSchema: Schema<IBadge> = new Schema<IBadge>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  criteria: { type: String, required: true },
  progressRequired: { type: Number, default: 100 }
}, { timestamps: true });

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;