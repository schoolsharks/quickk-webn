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


const adminService = new AdminService();
const userservice = new userService();
const companyFeatureService = new CompanyFeatureService();


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