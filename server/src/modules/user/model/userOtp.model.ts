import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUserOtp extends Document {
    user: mongoose.Types.ObjectId;
    otp: string;
    expiresAt: Date;
    compareOtp(candidateOtp: string): Promise<boolean>;
}

const UserOtpSchema = new Schema<IUserOtp>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

// TTL index to auto-delete expired OTPs
UserOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash OTP before saving
UserOtpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Instance method to compare OTP
UserOtpSchema.methods.compareOtp = async function (candidateOtp: string): Promise<boolean> {
    return bcrypt.compare(candidateOtp, this.otp);
};

const UserOtp = mongoose.model<IUserOtp>('UserOtp', UserOtpSchema);

export default UserOtp;
