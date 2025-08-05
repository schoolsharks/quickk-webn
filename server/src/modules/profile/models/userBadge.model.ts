import mongoose, { Schema } from 'mongoose';
import { IUserBadge } from '../types/interfaces';



const userBadgeSchema: Schema<IUserBadge> = new Schema<IUserBadge>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  badge: {
    type: Schema.Types.ObjectId,
    ref: "Badge",
    required: true
  },
  currentProgress: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  completedAt: { 
    type: Date 
  }
}, { timestamps: true });

// Create a compound index to ensure a user can have a unique progress for each badge
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const UserBadge = mongoose.model('UserBadge', userBadgeSchema);
export default UserBadge;