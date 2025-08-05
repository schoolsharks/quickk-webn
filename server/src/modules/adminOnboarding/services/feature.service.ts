import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { IFeature } from '../types/interfaces';
import Feature from '../models/feature.model';

class FeatureService {
    async getAllFeatures(): Promise<IFeature[]> {
        const features = await Feature.find({ isActive: true });
        return features;
    }

    async createFeature(name: string, description: string): Promise<IFeature> {
        const existingFeature = await Feature.findOne({ name });
        if (existingFeature) {
            throw new AppError('Feature already exists', StatusCodes.CONFLICT);
        }

        const newFeature = await Feature.create({
            name,
            description,
        });

        return newFeature;
    }

    async getFeatureById(featureId: mongoose.Types.ObjectId): Promise<IFeature> {
        const feature = await Feature.findById(featureId);
        if (!feature) {
            throw new AppError('Feature not found', StatusCodes.NOT_FOUND);
        }
        return feature;
    }

    async getFeaturesByIds(featureIds: mongoose.Types.ObjectId[]): Promise<IFeature[]> {
        const features = await Feature.find({ _id: { $in: featureIds }, isActive: true });
        return features;
    }
}

export default FeatureService;