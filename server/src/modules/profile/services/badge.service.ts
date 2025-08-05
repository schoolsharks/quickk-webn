import { Types } from 'mongoose';
import Badge from '../models/badge.model';
import UserBadge from '../models/userBadge.model';
import { generateTodayDate } from '../../../utils/generateTodayDate';

export class BadgeService {
  /**
   * Get all badges for a user with progress
   */
  async getUserBadges(userId: Types.ObjectId) {
    return await UserBadge.aggregate([
      { 
        $match: { user: userId } 
      },
      {
        $lookup: {
          from: 'badges',
          localField: 'badge',
          foreignField: '_id',
          as: 'badgeDetails'
        }
      },
      { $unwind: '$badgeDetails' },
      {
        $project: {
          _id: 1,
          currentProgress: 1,
          isCompleted: 1,
          completedAt: 1,
          'badgeDetails._id': 1,
          'badgeDetails.name': 1,
          'badgeDetails.description': 1,
          'badgeDetails.imageUrl': 1,
          'badgeDetails.criteria': 1,
          'badgeDetails.progressRequired': 1
        }
      },
      { $sort: { isCompleted: -1, currentProgress: -1 } }
    ]);
  }
  
  /**
   * Update progress for a user's badge
   */
  async updateBadgeProgress(userId: Types.ObjectId, badgeId: string, progressIncrement: number) {
    // Find badge to get required progress
    const badge = await Badge.findById(badgeId);
    if (!badge) throw new Error('Badge not found');
    
    // Find or create user badge progress
    let userBadge = await UserBadge.findOne({ 
      user: userId, 
      badge: badgeId
    });
    
    if (!userBadge) {
      userBadge = new UserBadge({
        user: userId,
        badge: badgeId,
        currentProgress: 0,
        isCompleted: false
      });
    }
    
    // Update progress
    userBadge.currentProgress += progressIncrement;
    
    // Check if badge is now completed
    if (userBadge.currentProgress >= badge.progressRequired && !userBadge.isCompleted) {
      userBadge.isCompleted = true;
      userBadge.completedAt = generateTodayDate();
      
      // We'll handle star awarding in the controller
    }
    
    await userBadge.save();
    return userBadge;
  }
  
  /**
   * Get all available badges with user progress
   */
  async getAllBadgesWithProgress(userId: Types.ObjectId) {
    // First get all badges
    const badges = await Badge.find();
    
    // Then get user's badge progress
    const userBadges = await UserBadge.find({ user: userId });
    
    // Create lookup map
    const userBadgeMap = new Map();
    userBadges.forEach(ub => userBadgeMap.set(ub.badge.toString(), ub));
    
    // Combine data
    return badges.map(badge => {
      const userBadge = userBadgeMap.get(badge._id.toString());
      return {
        ...badge.toObject(),
        currentProgress: userBadge?.currentProgress || 0,
        isCompleted: userBadge?.isCompleted || false,
        completedAt: userBadge?.completedAt || null
      };
    });
  }
}