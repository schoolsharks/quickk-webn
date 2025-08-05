import mongoose, { Schema, Model } from 'mongoose';
import { ICompanyFeature } from '../types/interfaces';


const CompanyFeatureSchema: Schema<ICompanyFeature> = new Schema<ICompanyFeature>(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            unique: true
        },
        features: [{
            type: Schema.Types.ObjectId,
            ref: 'Feature',
            required: true
        }],
    },
    { timestamps: true }
);

const CompanyFeature: Model<ICompanyFeature> = mongoose.model<ICompanyFeature>('CompanyFeature', CompanyFeatureSchema);
export default CompanyFeature;
