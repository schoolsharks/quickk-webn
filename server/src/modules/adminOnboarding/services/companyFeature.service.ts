import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { ICompanyFeature } from '../types/interfaces';
import CompanyFeature from '../models/companyFeature.model';

class CompanyFeatureService {
    async createCompanyFeatures(
        company: mongoose.Types.ObjectId,
        features: mongoose.Types.ObjectId[]
    ): Promise<ICompanyFeature> {
        const existingCompanyFeature = await CompanyFeature.findOne({ company });
        if (existingCompanyFeature) {
            throw new AppError('Company features already configured', StatusCodes.CONFLICT);
        }

        const newCompanyFeature = await CompanyFeature.create({
            company,
            features,
        });

        await newCompanyFeature.populate('features');

        return newCompanyFeature;
    }

    async getCompanyFeatures(company: mongoose.Types.ObjectId): Promise<ICompanyFeature | null> {
        const companyFeature = await CompanyFeature.findOne({ company }).populate('features');
        return companyFeature;
    }

    async updateCompanyFeatures(
        company: mongoose.Types.ObjectId,
        features: mongoose.Types.ObjectId[]
    ): Promise<ICompanyFeature> {
        const companyFeature = await CompanyFeature.findOneAndUpdate(
            { company },
            { features },
            { new: true }
        ).populate('features');

        if (!companyFeature) {
            throw new AppError('Company features not found', StatusCodes.NOT_FOUND);
        }

        return companyFeature;
    }
}

export default CompanyFeatureService;