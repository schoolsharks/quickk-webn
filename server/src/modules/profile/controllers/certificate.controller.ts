import { Request, Response } from 'express';
import { CertificateService } from '../services/certificate.service';
import { UserRewardsService } from '../services/rewards.service';
import { Types } from 'mongoose';
// Create singleton service instances
const certificateService = new CertificateService();
const userRewardsService = new UserRewardsService();

export class CertificateController {
  /**
   * Award a certificate for completing a module
   */
  async awardCertificate(req: Request, res: Response) {
    try {
      const { moduleId } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      if (!moduleId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Module ID is required' 
        });
      }
      
      const certificate = await certificateService.awardCertificate(userId, moduleId);
      
      // Award stars for obtaining a certificate
      await userRewardsService.awardStars(userId, 20);
      
      // Check if user levels up
      const levelStatus = await userRewardsService.checkAndUpdateUserLevel(userId);
      
      res.status(201).json({
        success: true,
        data: certificate,
        starsAwarded: 20,
        levelStatus
      });
    } catch (error :any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to award certificate', 
        error: error.message 
      });
    }
  }
  
  /**
   * Get all certificates for the current user
   */
  async getUserCertificates(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      const certificates = await certificateService.getUserCertificates(userId);
      
      res.status(200).json({
        success: true,
        data: certificates
      });
    } catch (error :any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch certificates', 
        error: error.message 
      });
    }
  }
  
  /**
   * Get details for a specific certificate
   */
  async getCertificateDetails(req: Request, res: Response) {
    try {
      const { certificateId} = req.params;
      
      if (!certificateId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Certificate ID is required' 
        });
      }
      
    const certificate = await certificateService.getUserCertificateDetails(new Types.ObjectId(certificateId));
      
      if (!certificate) {
        return res.status(404).json({ 
          success: false, 
          message: 'Certificate not found' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: certificate
      });
    } catch (error :any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch certificate details', 
        error: error.message 
      });
    }
  }
  
  /**
   * Verify a certificate by its unique ID
   */
  async verifyCertificate(req: Request, res: Response) {
    try {
      const { verificationId } = req.params;
      
      if (!verificationId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Verification ID is required' 
        });
      }
      
      const verificationResult = await certificateService.verifyCertificate(new Types.ObjectId(verificationId));
      
      res.status(200).json({
        success: true,
        data: verificationResult
      });
    } catch (error :any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to verify certificate', 
        error: error.message 
      });
    }
  }
}