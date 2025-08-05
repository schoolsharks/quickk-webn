import { Request, Response } from 'express';
import { BadgeService } from '../services/badge.service';
import { UserRewardsService } from '../services/rewards.service';

// Create singleton service instances
const badgeService = new BadgeService();
const userRewardsService = new UserRewardsService();

export class BadgeController {
  /**
   * Get all badges for the current user
   */
  async getUserBadges(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      const badges = await badgeService.getUserBadges(userId);
      
      res.status(200).json({
        success: true,
        data: badges
      });
    } catch (error : any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch badges', 
        error: error.message 
      });
    }
  }
  
  /**
   * Update badge progress
   */
  async updateBadgeProgress(req: Request, res: Response) {
    try {
      const { badgeId, progress } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      if (!badgeId || typeof progress !== 'number') {
        return res.status(400).json({ 
          success: false, 
          message: 'Badge ID and progress increment are required' 
        });
      }
      
      const updatedBadge = await badgeService.updateBadgeProgress(userId, badgeId, progress);
      
      // Award stars if badge was completed
      let starsAwarded = 0;
      if (updatedBadge.isCompleted && updatedBadge.completedAt) {
        starsAwarded = 50; // Example: Award 50 stars for completing a badge
        await userRewardsService.awardStars(userId, starsAwarded);
        
        // Check if user levels up
        await userRewardsService.checkAndUpdateUserLevel(userId);
      }
      
      res.status(200).json({
        success: true,
        data: updatedBadge,
        starsAwarded,
      });
    } catch (error : any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update badge progress', 
        error: error.message 
      });
    }
  }
  
  /**
   * Get all available badges with user progress
   */
  async getAllBadgesWithProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      const badges = await badgeService.getAllBadgesWithProgress(userId);
      
      res.status(200).json({
        success: true,
        data: badges
      });
    } catch (error : any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch badges with progress', 
        error: error.message 
      });
    }
  }
}