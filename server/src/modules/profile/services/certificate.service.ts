import { Types } from 'mongoose';
import Certificate from '../models/certificate.model';
import UserCertificate from '../models/userCertificate.model';
import { v4 as uuidv4 } from 'uuid';
import { generateTodayDate } from '../../../utils/generateTodayDate';

export class CertificateService {
  /**
   * Award a certificate to a user
   */
  async awardCertificate(userId: Types.ObjectId, moduleId: Types.ObjectId) {
    const certificate = await Certificate.findOne(moduleId);
    if (!certificate) throw new Error('Certificate not found for this module');
    
    // Create a unique certificate ID for verification
    const certificateId = uuidv4();
    
    // Check if user already has this certificate
    const existingCertificate = await UserCertificate.findOne({
      user: userId,
      certificate: certificate._id
    });
    
    if (existingCertificate) {
      return existingCertificate;
    }
    
    // Create new certificate for user
    const userCertificate = await UserCertificate.create({
      user: userId,
      certificate: certificate._id,
      issueDate: generateTodayDate(),
      certificateId
    });
    
    return userCertificate;
  }
  
  /**
   * Get all certificates for a user using aggregation
   */
  async getUserCertificates(userId: Types.ObjectId) {
    return await UserCertificate.aggregate([
      { 
        $match: { _id: userId } 
      },
      {
        $lookup: {
          from: 'certificates',
          localField: 'certificate',
          foreignField: '_id',
          as: 'certificateDetails'
        }
      },
      { $unwind: '$certificateDetails' },
      {
        $lookup: {
          from: 'modules',
          localField: 'certificateDetails.module',
          foreignField: '_id',
          as: 'moduleDetails'
        }
      },
      { $unwind: '$moduleDetails' },
      {
        $project: {
          _id: 1,
          certificateId: 1,
          issueDate: 1,
          'certificateDetails.title': 1,
          'certificateDetails.description': 1,
          'moduleDetails.title': 1,
          'moduleDetails.type': 1,
          'moduleDetails.duration': 1
        }
      }
    ]);
  }
  
  /**
   * Verify a certificate by its unique ID
   */
  async verifyCertificate(certificateId: Types.ObjectId) {
    const userCertificate = await UserCertificate.findOne( certificateId );
    if (!userCertificate) return { isValid: false };
    
    return {
      isValid: true,
      issueDate: userCertificate.issueDate,
      certificateDetails: await this.getUserCertificateDetails(userCertificate._id)
    };
  }
  
  /**
   * Get detailed information about a specific user certificate
   */
  async getUserCertificateDetails(userCertificateId: Types.ObjectId) {
    const [certificateDetails] = await UserCertificate.aggregate([
      { 
        $match: { _id: userCertificateId } 
      },
      {
        $lookup: {
          from: 'certificates',
          localField: 'certificate',
          foreignField: '_id',
          as: 'certificateDetails'
        }
      },
      { $unwind: '$certificateDetails' },
      {
        $lookup: {
          from: 'modules',
          localField: 'certificateDetails.module',
          foreignField: '_id',
          as: 'moduleDetails'
        }
      },
      { $unwind: '$moduleDetails' },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          certificateId: 1,
          issueDate: 1,
          'certificateDetails.title': 1,
          'certificateDetails.description': 1,
          'moduleDetails.title': 1,
          'moduleDetails.type': 1,
          'moduleDetails.duration': 1,
          'userDetails.name': 1,
          'userDetails.companyMail': 1
        }
      }
    ]);
    
    return certificateDetails;
  }
}