import { Request, Response, NextFunction } from 'express';
import userService from '../../user/service/user.service';
import { StatusCodes } from 'http-status-codes';
import CompanyService from '../../company/service/company.service';
import AdminService from '../service/admin.service';
import { setCookieOptions } from '../../../utils/cookieOptions';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils';
import Company from '../../company/model/company.model';
import AppError from '../../../utils/appError';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import generateOtp from '../../../utils/generateOtp';
import CompanyFeatureService from '../../adminOnboarding/services/companyFeature.service';
import adminOtpTrigger from '../../../services/emails/triggers/admin/adminOtpTrigger';
import { EventService } from '../../events/services/events.services';
import { IUser } from '../../user/types/interfaces';
import UserRewardClaimsService from '../../rewardsAndResources/services/userRewardClaims.service';


const adminService = new AdminService();
const userservice = new userService();
const companyFeatureService = new CompanyFeatureService();
const eventService = new EventService();
const userRewardClaimsService = new UserRewardClaimsService();


export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // const adminId = req.user?.id;
        // const admin = await adminService.getAdminById(adminId);
        const newUser = await userservice.registerUserWithCompanyCheck(req.body);
        res.status(StatusCodes.CREATED).json({ success: true, data: newUser });
    } catch (error) {
        next(error);
    }
};

export const registerCompanyWithAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { companyName, companyCode, adminName, adminEmail } = req.body;

        // Step 1: Register the company
        const companyService = new CompanyService();
        const newCompany = await companyService.createCompany(companyName, companyCode);

        // Step 2: Register the admin with reference to the company
        const adminService = new AdminService();
        const newAdmin = await adminService.createAdmin({
            adminName,
            adminEmail,
            company: newCompany._id, // Reference to the newly created company
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: { company: newCompany, admin: newAdmin }
        });
    } catch (error) {
        next(error);
    }
};

export const registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user?.id;
        const adminService = new AdminService();
        const admin = await adminService.findAdminById(adminId);

        if (!admin) {
            res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Admin not found" });
            return;
        }

        const company = admin.company;
        const { adminName, adminEmail } = req.body;
        const adminservice = new AdminService();
        const newAdmin = await adminservice.createAdmin({ adminName, adminEmail, company });
        res.status(StatusCodes.CREATED).json({ success: true, data: newAdmin });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { adminEmail, companyCode } = req.body;

        const admin = await adminService.findAdminByEmail(adminEmail);
        if (!admin) {
            res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Admin not found" });
            return;
        }
        const company = await Company.findById(admin.company);
        // console.log(company?.companyCode);
        // console.log(companyCode);


        if (!company || !(companyCode === company.companyCode)) {
            return next(new AppError("Comapny code didn't match.", 404));
        }

        const accessToken = generateAccessToken(admin._id.toString(), "ADMIN", admin.company.toString());
        const refreshToken = generateRefreshToken(admin._id.toString());

        res.cookie("accessToken", accessToken, setCookieOptions);
        res.cookie("refreshToken", refreshToken, { ...setCookieOptions, httpOnly: true });
        res.json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }

};

export const getAdminById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.user?.id;
        const companyId = req.user?.companyId;

        const admin = await adminService.findAdminById(new mongoose.Types.ObjectId(adminId));
        const companyFeature = await companyFeatureService.getCompanyFeatures(new mongoose.Types.ObjectId(companyId));

        res.status(StatusCodes.OK).json({ success: true, data: { admin, companyFeature } });
    } catch (error) {
        next(error);
    }
};


export const refreshAdminToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return next(new AppError("Refresh token missing", 401));
        }

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
        } catch (err) {
            return next(new AppError("Invalid refresh token", 403));
        }

        const admin = await adminService.findAdminById(payload.id);
        if (!admin) {
            return next(new AppError("Admin not found", 404));
        }

        const accessToken = generateAccessToken(admin._id.toString(), "ADMIN", admin.company.toString());
        res.cookie("accessToken", accessToken, setCookieOptions);
        res.json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};


// Controller to verify admin OTP
export const verifyAdminOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { adminId, otp } = req.body;
        const result = await adminService.verifyAdminOtp({
            adminId: adminId,
            otp,
        });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

// Controller to resend admin OTP
export const resendAdminOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { adminId } = req.body;
        const otp = generateOtp();
        const data = await adminService.findAdminById(adminId);
        await adminOtpTrigger({ email: data.email, otp });
        const result = await adminService.resendAdminOtp({
            adminId: adminId,
            otp,
        });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.clearCookie("accessToken", setCookieOptions);
        res.clearCookie("refreshToken", { ...setCookieOptions, httpOnly: true });
        res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};


export const checkAdminEmailExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { adminEmail } = req.body;
        const adminExists = await adminService.doesAdminExistByEmail(adminEmail);
        if (adminExists) {
            res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: 'Admin with the same email already exists'
            });
            return;
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Admin email is available'
        });
    } catch (error) {
        next(error);
    }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        
        // Get total users count for this company
        const allUsers = await userservice.getAllUsers(companyId);
        const totalMembers = allUsers.length;
        
        // Get total signups (we'll consider all users as signups)
        const totalSignups = allUsers.filter((user: IUser) => !user.webnClubMember).length;
        
        // Get upcoming events count
        const upcomingEventsResult = await eventService.getUpcomingEvents(1, 1000); // Get all upcoming events
        const upcomingEventsCount = upcomingEventsResult.total;
        
        const dashboardStats = {
            totalMembers,
            totalSignups,
            upcomingEvents: upcomingEventsCount
        };
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Dashboard stats retrieved successfully',
            data: dashboardStats
        });
    } catch (error) {
        next(error);
    }
};

export const getEngagementAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        
        if (!companyId) {
            throw new AppError('Company ID not found', StatusCodes.BAD_REQUEST);
        }

        const engagementData = await userservice.getEngagementAnalytics(companyId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Engagement analytics retrieved successfully',
            data: engagementData
        });
    } catch (error) {
        next(error);
    }
};

export const getParticipationLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        
        if (!companyId) {
            throw new AppError('Company ID not found', StatusCodes.BAD_REQUEST);
        }

        const participationData = await userservice.getParticipationLeaderboard(companyId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Participation leaderboard retrieved successfully',
            data: participationData
        });
    } catch (error) {
        next(error);
    }
};

export const getReferralStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;

        if (!companyId) {
            throw new AppError('Company ID not found', StatusCodes.BAD_REQUEST);
        }

        const stats = await userservice.getReferralStats(companyId.toString());

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Referral stats retrieved successfully',
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

export const getReferralUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;

        if (!companyId) {
            throw new AppError('Company ID not found', StatusCodes.BAD_REQUEST);
        }

        const search = typeof req.query.search === 'string' ? req.query.search : undefined;
        const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;

        const referralUsers = await userservice.getReferralUsers({
            companyId: companyId.toString(),
            search,
            page,
            limit,
            sortBy,
        });

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Referral users retrieved successfully',
            data: referralUsers,
        });
    } catch (error) {
        next(error);
    }
};

export const markReferralAdvertisementDisplayed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const { claimId } = req.params;

        if (!companyId) {
            throw new AppError('Company ID not found', StatusCodes.BAD_REQUEST);
        }

        if (!claimId) {
            throw new AppError('Claim ID is required', StatusCodes.BAD_REQUEST);
        }

        const updatedClaim = await userRewardClaimsService.markAdvertisementAsDisplayed(claimId, companyId.toString());

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Advertisement marked as displayed successfully',
            data: {
                claimId: updatedClaim._id,
                advertised: updatedClaim.advertised,
            },
        });
    } catch (error) {
        next(error);
    }
};