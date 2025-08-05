import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdminOtp extends Document {
    admin: mongoose.Types.ObjectId;
    otp: string;
    expiresAt: Date;
}

const AdminOtpSchema = new Schema<IAdminOtp>({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
});

// TTL index
AdminOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash OTP before saving
AdminOtpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

const AdminOtp = mongoose.model<IAdminOtp>('AdminOtp', AdminOtpSchema);

export default AdminOtp;