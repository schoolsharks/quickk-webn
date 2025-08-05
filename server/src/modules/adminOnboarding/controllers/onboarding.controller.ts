import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import OnboardingService from '../services/onboarding.service';
import FeatureService from '../services/feature.service';
import CompanyFeatureService from '../services/companyFeature.service';
import CompanyService from '../../company/service/company.service';


const onboardingService = new OnboardingService();
const featureService = new FeatureService();
const companyFeatureService = new CompanyFeatureService();
const companyService = new CompanyService();

export const completeOnboarding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { companyName, adminName, adminEmail, selectedFeatures } = req.body;

        const companyCode = await companyService.generateUniqueCompanyCode();

        const result = await onboardingService.completeOnboarding({
            companyName,
            companyCode,
            adminName,
            adminEmail,
            selectedFeatures,
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: result,
            message: 'Onboarding completed successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFeatures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const features = await featureService.getAllFeatures();
        res.status(StatusCodes.OK).json({
            success: true,
            data: features
        });
    } catch (error) {
        next(error);
    }
};

export const getCompanyFeatures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user?.id;
        const companyId = req.user?.companyId;

        if (!adminId || !companyId) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Admin or company not found'
            });
            return;
        }

        const companyFeatures = await companyFeatureService.getCompanyFeatures(new mongoose.Types.ObjectId(companyId));
        res.status(StatusCodes.OK).json({
            success: true,
            data: companyFeatures
        });
    } catch (error) {
        next(error);
    }
};