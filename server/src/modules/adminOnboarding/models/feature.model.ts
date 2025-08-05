import { Schema, model } from 'mongoose';
import { IFeature } from '../types/interfaces';


// Define the schema for Feature
const FeatureSchema: Schema<IFeature> = new Schema<IFeature>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Create the model
const Feature = model<IFeature>('Feature', FeatureSchema);

export default Feature;