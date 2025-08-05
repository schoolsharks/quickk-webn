import EmailVerficationOtp from '../../../services/emails/triggers/admin/otp-triger';
import generateOtp from '../../../utils/generateOtp';
import AdminService from '../../admin/service/admin.service';
import CompanyService from '../../company/service/company.service';
import CompanyFeatureService from './companyFeature.service';
import mongoose from 'mongoose';

interface OnboardingData {
    companyName: string;
    companyCode: string;
    adminName: string;
    adminEmail: string;
    selectedFeatures: string[];
}

class OnboardingService {
    private adminService: AdminService;
    private companyService: CompanyService;
    private companyFeatureService: CompanyFeatureService;

    constructor() {
        this.adminService = new AdminService();
        this.companyService = new CompanyService();
        this.companyFeatureService = new CompanyFeatureService();
    }

    async completeOnboarding(data: OnboardingData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Step 1: Create company
            const newCompany = await this.companyService.createCompany(
                data.companyName,
                data.companyCode
            );




            // Step 2: Create root admin
            const newAdmin = await this.adminService.createAdmin({
                adminName: data.adminName,
                adminEmail: data.adminEmail,
                company: newCompany?._id,
            });

            const otp = generateOtp();
            await EmailVerficationOtp(otp, data.adminEmail);

            await this.adminService.createAdminOtp({
                adminId: newAdmin._id,
                otp,
            });


            // Step 3: Convert feature names to ObjectIds
            const featureObjectIds = data.selectedFeatures.map(
                id => new mongoose.Types.ObjectId(id)
            );

            // Step 4: Create company features
            const companyFeatures = await this.companyFeatureService.createCompanyFeatures(
                newCompany._id,
                featureObjectIds
            );

            await session.commitTransaction();

            return {
                company: newCompany,
                admin: newAdmin,
                features: companyFeatures,
                otp:otp,
            };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default OnboardingService;