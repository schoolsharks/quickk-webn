import UserResourceRating, { ResourceRatingStatus, IUserResourceRating } from "../model/user.resource.rating.model";
import mongoose from "mongoose";

class UserResourceRatingService {
  /**
   * Create a resource rating request when user claims a resource
   */
  async createResourceRating(userId: mongoose.Types.ObjectId, resourceId: mongoose.Types.ObjectId, claimedAt: Date = new Date()): Promise<IUserResourceRating> {
    // Calculate pulse timing
    const nextPulseAt = new Date(claimedAt);
    nextPulseAt.setHours(nextPulseAt.getHours() + 48); // 48 hours after claiming

    // Set expiry to 30 days
    const expiresAt = new Date(claimedAt);
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Check if rating already exists
    const existingRating = await UserResourceRating.findOne({
      userId,
      resourceId,
    });

    if (existingRating) {
      // If already exists, don't create duplicate
      return existingRating;
    }

    const resourceRating = new UserResourceRating({
      userId,
      resourceId,
      claimedAt,
      status: ResourceRatingStatus.PENDING,
      nextPulseAt,
      expiresAt,
    });

    return await resourceRating.save();
  }

  /**
   * Get pending resource ratings ready for pulse (oldest first, one at a time)
   */
  async getPendingResourceRatingsForPulse(userId: mongoose.Types.ObjectId): Promise<IUserResourceRating | null> {
    const now = new Date();

    // Find the oldest pending rating that's ready for pulse
    const rating = await UserResourceRating.findOne({
      userId,
      status: ResourceRatingStatus.PENDING,
    //   nextPulseAt: { $lte: now },
    })
    .sort({ claimedAt: 1 }) // Oldest first
    .populate('resourceId', 'heading companyName'); // Populate resource details

    return rating;
  }

  /**
   * Submit user's rating response
   */
  async submitResourceRatingResponse(
    ratingId: string,
    userId: mongoose.Types.ObjectId,
    rating: number
  ): Promise<IUserResourceRating> {
    const resourceRating = await UserResourceRating.findOne({
      _id: ratingId,
      userId,
      status: ResourceRatingStatus.PENDING,
    });

    if (!resourceRating) {
      throw new Error("Resource rating not found or already completed");
    }

    // Validate rating (1-5 stars)
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }

    // Update with rating and mark as completed
    resourceRating.rating = rating;
    resourceRating.status = ResourceRatingStatus.RATED;

    return await resourceRating.save();
  }

  /**
   * Handle when user ignores the pulse (reschedule for next day)
   */
  async rescheduleResourceRating(ratingId: string, userId: mongoose.Types.ObjectId): Promise<IUserResourceRating> {
    const resourceRating = await UserResourceRating.findOne({
      _id: ratingId,
      userId,
      status: ResourceRatingStatus.PENDING,
    });

    if (!resourceRating) {
      throw new Error("Resource rating not found or already completed");
    }

    // Set next pulse to 24 hours from now
    const nextPulse = new Date();
    nextPulse.setHours(nextPulse.getHours() + 24);
    resourceRating.nextPulseAt = nextPulse;

    return await resourceRating.save();
  }

  /**
   * Get all resource ratings for a user (for analytics/history)
   */
  async getUserResourceRatings(userId: mongoose.Types.ObjectId, status?: ResourceRatingStatus): Promise<IUserResourceRating[]> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    return await UserResourceRating.find(query)
      .populate('resourceId', 'heading companyName')
      .sort({ createdAt: -1 });
  }

  /**
   * Get resource rating statistics
   */
  async getResourceRatingStats(resourceId: mongoose.Types.ObjectId): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { stars: number; count: number }[];
  }> {
    const ratings = await UserResourceRating.find({
      resourceId,
      status: ResourceRatingStatus.RATED,
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, rating) => sum + (rating.rating || 0), 0) / totalRatings 
      : 0;

    // Calculate distribution
    const distribution = [1, 2, 3, 4, 5].map(stars => ({
      stars,
      count: ratings.filter(rating => rating.rating === stars).length,
    }));

    return {
      totalRatings,
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      ratingDistribution: distribution,
    };
  }
}

export default UserResourceRatingService;