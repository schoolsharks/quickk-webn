import mongoose, { Schema } from 'mongoose';
import { IUserOffer } from '../types/interfaces';


const userOfferSchema: Schema<IUserOffer> = new Schema<IUserOffer>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  offer: {
    type: Schema.Types.ObjectId,
    ref: "Offer",
    required: true
  },
  redeemed: { 
    type: Boolean, 
    default: false 
  },
  redeemedAt: { 
    type: Date 
  },
  isUnlocked: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

userOfferSchema.index({ user: 1, offer: 1 }, { unique: true });

const UserOffer = mongoose.model('UserOffer', userOfferSchema);
export default UserOffer;