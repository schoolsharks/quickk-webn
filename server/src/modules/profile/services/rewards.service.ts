import { Types } from 'mongoose';
import { generateTodayDate } from '../../../utils/generateTodayDate';
import User from '../../user/model/user.model';

export class UserRewardsService {
  /**
   * Update user learning streak
   */
  async updateLearningStreak(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const now = generateTodayDate();
    const lastActivity = user.lastLearningActivity;
    
    // If no previous activity or it was more than 48 hours ago, reset streak
    if (!lastActivity || now.getTime() - lastActivity.getTime() > 24 * 60 * 60 * 1000) {
      user.learningStreak = 1;
    } 
    // If last activity was yesterday, increment streak
    else if (
      now.getTime() - lastActivity.getTime() <= 48 * 60 * 60 * 1000 &&
      now.getDate() !== lastActivity.getDate()
    ) {
      user.learningStreak += 1;
    }
    
    user.lastLearningActivity = now;
    await user.save();
    return user.learningStreak;
  }
  
  /**
   * Award stars to user
   */
  async awardStars(userId: Types.ObjectId, starsToAdd: number) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    user.totalStars += starsToAdd;
    await user.save();
    return user.totalStars;
  }
  
  /**
   * Get user rewards profile
   */
  async getUserRewardsProfile(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    return {
      totalStars: user.totalStars,
      redeemedStars: user.redeemedStars,
      learningStreak: user.learningStreak,
      level: user.level,
      lastLearningActivity: user.lastLearningActivity
    };
  }
  
  /**
   * Level up user if they meet requirements
   */
  async checkAndUpdateUserLevel(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Simple level up logic - customize based on your requirements
    const levelThresholds = [0, 100, 300, 600, 1000, 1500]; // Stars needed for levels 1-6
    
    let newLevel = 1;
    for (let i = 1; i < levelThresholds.length; i++) {
      if (user.totalStars >= levelThresholds[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }
    
    if (newLevel > user.level) {
      user.level = newLevel;
      await user.save();
      return { leveledUp: true, newLevel };
    }
    
    return { leveledUp: false, currentLevel: user.level };
  }
}