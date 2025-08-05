import Admin, { IAdmin } from '../model/admin.model';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AdminOtp from '../model/adminOtp.model';
import bcrypt from 'bcrypt';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
});

class AdminService {
    async createAdmin({
        adminName,
        adminEmail,
        company
    }: {
        adminName: string;
        adminEmail: string;
        company: mongoose.Types.ObjectId;
    }) {
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            throw new AppError('Admin already exists', StatusCodes.CONFLICT);
        }

        const newAdmin = await Admin.create({
            name: adminName,
            email: adminEmail,
            role: 'admin',
            company: company,
        });

        return newAdmin;
    }

    async findAdminByEmail(adminEmail: string): Promise<IAdmin | null> {
        const admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            throw new AppError('Admin not found', StatusCodes.NOT_FOUND);
        }
        return admin;
    }

    async findAdminById(adminId: mongoose.Types.ObjectId): Promise<IAdmin> {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new AppError('Admin not found', StatusCodes.NOT_FOUND);
        }
        return admin;
    }

    async getAdminById(adminId: mongoose.Types.ObjectId): Promise<IAdmin | null> {
        const admin = await Admin.findById(adminId);
        return admin;
    }

    async doesAdminExistByEmail(adminEmail: string): Promise<boolean> {
        const admin = await Admin.findOne({ email: adminEmail });
        return !!admin;
    }

    async createAdminOtp({
        adminId,
        otp,
    }: {
        adminId: mongoose.Types.ObjectId;
        otp: string;
    }) {
        const adminOtp = await AdminOtp.create({
            admin: adminId,
            otp,
        });
        return adminOtp;
    }

    async verifyAdminOtp({
        adminId,
        otp,
    }: {
        adminId: mongoose.Types.ObjectId;
        otp: string;
    }) {
        const adminOtpDoc = await AdminOtp.findOne({ admin: adminId }).sort({ expiresAt: -1 });
        if (!adminOtpDoc) {
            throw new AppError('OTP not found or expired', StatusCodes.NOT_FOUND);
        }

        // Check if OTP is expired
        if (adminOtpDoc.expiresAt < new Date()) {
            await AdminOtp.deleteOne({ _id: adminOtpDoc._id });
            throw new AppError('OTP expired', StatusCodes.GONE);
        }

        // Compare OTP
        const isMatch = await bcrypt.compare(otp, adminOtpDoc.otp);
        if (!isMatch) {
            throw new AppError('Invalid OTP', StatusCodes.UNAUTHORIZED);
        }

        // OTP is valid, delete it after use
        await AdminOtp.deleteOne({ _id: adminOtpDoc._id });

        return { success: true, message: 'OTP verified successfully' };
    }

    async resendAdminOtp({
        adminId,
        otp,
    }: {
        adminId: mongoose.Types.ObjectId;
        otp: string;
    }) {
        // Check if admin exists
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new AppError('Admin not found', StatusCodes.NOT_FOUND);
        }

        // Optionally, remove any existing OTPs for this admin
        await AdminOtp.deleteMany({ admin: adminId });

        // Create new OTP
        const adminOtp = await AdminOtp.create({
            admin: adminId,
            otp,
        });

        return {
            success: true,
            message: 'OTP resent successfully',
            adminOtp,
        };
    }



    
    getS3Uploader(moduleFolder: string) {
        return multer({
            storage: multerS3({
                s3,
                bucket: process.env.AWS_S3_BUCKET_NAME!,
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
                    const uniqueName = `${moduleFolder}/${Date.now()}-${file.originalname}`;
                    cb(null, uniqueName);
                },
            }),
        });
    }

    /**
     * Deletes an image from S3 given its URL.
     * @param {string} imageUrl
     */
    async deleteImageFromS3(imageUrl: string): Promise<void> {
        try {
            const bucketName = process.env.AWS_S3_BUCKET_NAME!;
            const bucketUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
            const key = decodeURIComponent(imageUrl.replace(bucketUrl, ""));
            if (!key) {
                console.warn("S3 key not found in the image URL:", imageUrl);
                return;
            }
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            });
            await s3.send(command);
        } catch (error) {
            console.error("Error deleting image from S3:", error);
            throw error;
        }
    }

}

export default AdminService;