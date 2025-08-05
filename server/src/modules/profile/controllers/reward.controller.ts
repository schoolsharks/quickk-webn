import { Request, Response } from 'express';
import { UserRewardsService } from '../services/rewards.service';
import { BadgeService } from '../services/badge.service';
import { OfferService } from '../services/offer.service';
import { CertificateService } from '../services/certificate.service';

// Create singleton service instances
const userRewardsService = new UserRewardsService();
const badgeService = new BadgeService();
const offerService = new OfferService();
const certificateService = new CertificateService();

export class UserRewardsController {
  /**
   * Record a learning activity and update streak
   */
  async recordLearningActivity(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const streak = await userRewardsService.updateLearningStreak(userId);
      res.status(200).json({ success: true, data: { learningStreak: streak } });
    } catch (error : any) {
      res.status(500).json({ success: false, message: 'Failed to record learning activity', error: error.message });
    }
  }

  /**
   * Award stars to a user
   */
  async awardStars(req: Request, res: Response) {
    try {
      const { stars, reason } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      if (!stars || typeof stars !== 'number' || stars <= 0) {
        return res.status(400).json({ success: false, message: 'Valid stars amount is required' });
      }

      const totalStars = await userRewardsService.awardStars(userId, stars);
      
      // Check if user levels up
      const levelStatus = await userRewardsService.checkAndUpdateUserLevel(userId);

      res.status(200).json({ 
        success: true, 
        data: { 
          starsAwarded: stars, 
          totalStars, 
          reason: reason || 'System awarded', 
          levelStatus 
        } 
      });
    } catch (error : any) {
      res.status(500).json({ success: false, message: 'Failed to award stars', error: error.message });
    }
  }

  /**
   * Get complete user rewards profile
   */
  async getUserRewardsProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      // Get user stats
      const rewardsProfile = await userRewardsService.getUserRewardsProfile(userId);
      
      // Get badges
      const badges = await badgeService.getUserBadges(userId);
      
      // Get certificates
      const certificates = await certificateService.getUserCertificates(userId);
      
      // Get available offers
      const offers = await offerService.getAvailableOffers(userId);

      res.status(200).json({
        success: true,
        data: {
          ...rewardsProfile,
          badges,
          certificates,
          offers
        }
      });
    } catch (error : any) {
      res.status(500).json({ success: false, message: 'Failed to get rewards profile', error: error.message });
    }
  }



 
}