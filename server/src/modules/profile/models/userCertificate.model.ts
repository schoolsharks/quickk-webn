import mongoose, { Schema } from 'mongoose';
import { IUserCertificate } from '../types/interfaces';

const userCertificateSchema: Schema<IUserCertificate> = new Schema<IUserCertificate>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  certificate: {
    type: Schema.Types.ObjectId,
    ref: "Certificate",
    required: true
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  certificateId: { 
    type: String, 
    required: true,
    unique: true 
  }
}, { timestamps: true });

// Ensure a user can have a unique certificate for each module
userCertificateSchema.index({ user: 1, certificate: 1 }, { unique: true });

const UserCertificate = mongoose.model('UserCertificate', userCertificateSchema);
export default UserCertificate;