import { Request, Response } from 'express';
import { OfferService } from '../services/offer.service';
import { UserRewardsService } from '../services/rewards.service';

// Create singleton service instances
const offerService = new OfferService();
const userRewardsService = new UserRewardsService();

export class OfferController {
  /**
   * Get all available offers for the current user
   */
  async getAvailableOffers(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      const offers = await offerService.getAvailableOffers(userId);
      
      res.status(200).json({
        success: true,
        data: offers
      });
    } catch (error : any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch offers', 
        error: error.message 
      });
    }
  }
  
  /**
   * Get user's unlocked offers with details
   */
  async getUserOffers(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      const userOffers = await offerService.getUserOffersWithDetails(userId);
      
      res.status(200).json({
        success: true,
        data: userOffers
      });
    } catch (error :any) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch user offers', 
        error: error.message 
      });
    }
  }
  
  /**
   * Redeem an offer
   */
  async redeemOffer(req: Request, res: Response) {
    try {
      const { offerId } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      if (!offerId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Offer ID is required' 
        });
      }
      
      const result = await offerService.redeemStarsForOffer(userId, offerId);
      
      // Check if user levels up after redeeming
      const levelStatus = await userRewardsService.checkAndUpdateUserLevel(userId);
      
      res.status(200).json({
        success: true,
        data: result,
        levelStatus
      });
    } catch (error : any) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
  
  /**
   * Unlock an offer for a user
   */
  async unlockOffer(req: Request, res: Response) {
    try {
      const { offerId } = req.body;
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      
      if (!offerId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Offer ID is required' 
        });
      }
      
      const result = await offerService.unlockOffer(userId, offerId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error :any) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}