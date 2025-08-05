import { Types } from 'mongoose';
import User from '../../user/model/user.model';
import Offer from '../models/offer.model';
import UserOffer from '../models/userOffer.model';
import { generateTodayDate } from '../../../utils/generateTodayDate';

export class OfferService {
  /**
   * Get all available offers for a user with their unlocked status
   */
  async getAvailableOffers(userId : Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Get all active offers
    const offers = await Offer.find({ isActive: true });
    
    // Get user's offer statuses
    const userOffers = await UserOffer.find(userId);
    
    // Create a map for quick lookup
    const userOffersMap = new Map();
    userOffers.forEach(uo => userOffersMap.set(uo.offer.toString(), uo));
    
    // Map offers with user-specific data
    return offers.map(offer => {
      const userOffer = userOffersMap.get(offer._id.toString());
      return {
        ...offer.toObject(),
        isUnlocked: userOffer?.isUnlocked || false,
        isRedeemed: userOffer?.redeemed || false,
        canUnlock: user.level >= (offer.unlockLevel || 1) && user.totalStars >= offer.pointsRequired
      };
    });
  }

  /**
   * Get offers using aggregation pipeline
   */
  async getUserOffersWithDetails(userId: Types.ObjectId) {
    return await UserOffer.aggregate([
      { 
        $match: { userId } 
      },
      {
        $lookup: {
          from: 'offers',
          localField: 'offer',
          foreignField: '_id',
          as: 'offerDetails'
        }
      },
      { $unwind: '$offerDetails' },
      {
        $project: {
          _id: 1,
          isUnlocked: 1,
          redeemed: 1,
          redeemedAt: 1,
          'offerDetails._id': 1,
          'offerDetails.title': 1,
          'offerDetails.description': 1,
          'offerDetails.partner': 1,
          'offerDetails.partnerLogo': 1,
          'offerDetails.discountValue': 1,
          'offerDetails.minimumPurchase': 1,
          'offerDetails.validDays': 1,
          'offerDetails.pointsRequired': 1,
          'offerDetails.unlockLevel': 1,
          'offerDetails.expiryDate': 1,
          'offerDetails.isActive': 1
        }
      }
    ]);
  }

  /**
   * Redeem stars for an offer
   */
  async redeemStarsForOffer(userId: Types.ObjectId, offerId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const offer = await Offer.findById(offerId);
    if (!offer) throw new Error('Offer not found');
    
    const userOffer = await UserOffer.findOne({ 
      user: userId, 
      offer: offerId 
    });
    
    // Check if user has enough stars and meets level requirements
    if (user.totalStars < offer.pointsRequired) {
      throw new Error('Not enough stars to redeem this offer');
    }
    
    if (offer.unlockLevel && user.level < offer.unlockLevel) {
      throw new Error(`This offer requires level ${offer.unlockLevel}`);
    }
    
    // If the offer is not unlocked yet, unlock it
    if (!userOffer?.isUnlocked) {
      await UserOffer.findOneAndUpdate(
        { user: userId, offer: offerId },
        { isUnlocked: true },
        { upsert: true, new: true }
      );
    }
    
    // Mark as redeemed if not already
    if (userOffer && !userOffer.redeemed) {
      userOffer.redeemed = true;
      userOffer.redeemedAt = generateTodayDate();
      await userOffer.save();
    }

    // FIXED: Deduct stars from totalStars, not just add to redeemedStars
    user.totalStars -= offer.pointsRequired;
    user.redeemedStars += offer.pointsRequired;
    await user.save();
    
    return userOffer;
  }
  
  /**
   * Unlock an offer for a user
   */
  async unlockOffer(userId: Types.ObjectId, offerId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const offer = await Offer.findById(offerId);
    if (!offer) throw new Error('Offer not found');
    
    // Check if level requirement is met
    if (offer.unlockLevel && user.level < offer.unlockLevel) {
      throw new Error(`This offer requires level ${offer.unlockLevel}`);
    }
    
    // Create or update user offer
    const userOffer = await UserOffer.findOneAndUpdate(
      { user: userId, offer: offerId},
      { isUnlocked: true },
      { upsert: true, new: true }
    );
    
    return userOffer;
  }
}