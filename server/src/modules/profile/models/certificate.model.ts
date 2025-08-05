import mongoose, { Schema } from 'mongoose';
import { ICertificate } from '../types/interfaces';

const certificateSchema: Schema<ICertificate> = new Schema<ICertificate>({
  title: { type: String, required: true },
  description: { type: String },
  module: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true
  },
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;