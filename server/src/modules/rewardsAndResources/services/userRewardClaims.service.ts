import mongoose from "mongoose";
import UserRewardsClaims from "../models/userRewardClaims";
import UserService from "../../user/service/user.service";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { RewardTypes } from "../types/enums";
import { IUserRewardsClaims } from "../types/interface";

class UserRewardClaimsService {
  private userService = new UserService();
  private readonly ADVERTISEMENT_STARS_REQUIRED = 1000;

  async applyForReward(
    userId: mongoose.Types.ObjectId,
    rewardType: RewardTypes,
    advertisementBannerUrl?: string,
    resourceId?: string,
    userInput?: string
  ): Promise<IUserRewardsClaims> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // For RESOURCES type, check if user has already claimed this specific resource
      let existingClaim;
      if (rewardType === RewardTypes.RESOURCES && resourceId) {
        existingClaim = await UserRewardsClaims.findOne({
          user: userId,
          rewardType,
          resourceId: new mongoose.Types.ObjectId(resourceId),
        }).session(session);
      } else {
        // For other reward types, check by reward type only
        existingClaim = await UserRewardsClaims.findOne({
          user: userId,
          rewardType,
        }).session(session);
      }

      if (existingClaim) {
        const errorMessage = rewardType === RewardTypes.RESOURCES 
          ? "You have already claimed this resource"
          : "You have already applied for this reward type";
        throw new AppError(errorMessage, StatusCodes.CONFLICT);
      }

      // Get user details to check stars
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }

      // Determine required stars based on reward type
      let requiredStars = this.ADVERTISEMENT_STARS_REQUIRED;
      if (rewardType === RewardTypes.RESOURCES && resourceId) {
        // Get resource details to check required stars
        const ResourcesService = (await import('../services/resources.service')).default;
        const resourcesService = new ResourcesService();
        const resource = await resourcesService.getResourceById(resourceId);
        requiredStars = resource.stars;
      }

      // Check if user has enough stars
      if (user.totalStars < requiredStars) {
        throw new AppError(
          `Insufficient stars. You need ${requiredStars} stars but have only ${user.totalStars} stars`,
          StatusCodes.BAD_REQUEST
        );
      }

      // Deduct stars from user
      await this.userService.deductStars(userId, requiredStars, session);

      // Create reward claim
      const rewardClaimData: any = {
        user: userId,
        rewardType,
      };

      if (advertisementBannerUrl) {
        rewardClaimData.advertisementBannerUrl = advertisementBannerUrl;
      }
      
      if (resourceId) {
        rewardClaimData.resourceId = new mongoose.Types.ObjectId(resourceId);
      }
      
      if (userInput) {
        rewardClaimData.userInput = userInput;
      }

      const rewardClaim = new UserRewardsClaims(rewardClaimData);

      const savedClaim = await rewardClaim.save({ session });

      await session.commitTransaction();

      // Populate user data before returning
      await savedClaim.populate("user", "name companyMail");

      return savedClaim;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async isRewardClaimed(
    userId: mongoose.Types.ObjectId,
    rewardType: RewardTypes
  ): Promise<boolean> {
    try {
      const existingClaim = await UserRewardsClaims.findOne({
        user: userId,
        rewardType,
      });

      return !!existingClaim;
    } catch (error) {
      throw new AppError(
        "Failed to check reward claim status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isResourceClaimed(
    userId: mongoose.Types.ObjectId,
    resourceId: string
  ): Promise<boolean> {
    try {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(resourceId)) {
        throw new AppError('Invalid resource ID format', StatusCodes.BAD_REQUEST);
      }

      const existingClaim = await UserRewardsClaims.findOne({
        user: userId,
        rewardType: RewardTypes.RESOURCES,
        resourceId: new mongoose.Types.ObjectId(resourceId),
      });

      return !!existingClaim;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Failed to check resource claim status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markAdvertisementAsDisplayed(
    claimId: string,
    companyId: string
  ): Promise<IUserRewardsClaims> {
    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      throw new AppError("Invalid claim id", StatusCodes.BAD_REQUEST);
    }

    const claim = await UserRewardsClaims.findById(claimId);

    if (!claim) {
      throw new AppError("Advertisement claim not found", StatusCodes.NOT_FOUND);
    }

    if (claim.rewardType !== RewardTypes.ADVERTISEMENT) {
      throw new AppError(
        "Claim is not an advertisement reward",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await this.userService.getUserById(
      claim.user as mongoose.Types.ObjectId
    );

    if (!user || user.company?.toString() !== companyId) {
      throw new AppError(
        "You do not have access to update this claim",
        StatusCodes.FORBIDDEN
      );
    }

    if (claim.advertised) {
      return claim;
    }

    claim.advertised = true;
    await claim.save();

    return claim;
  }

  async getUserRewardClaim(
    userId: mongoose.Types.ObjectId,
    rewardType: RewardTypes
  ): Promise<IUserRewardsClaims | null> {
    try {
      const claim = await UserRewardsClaims.findOne({
        user: userId,
        rewardType
      });

      return claim;
    } catch (error) {
      throw new AppError(
        "Failed to get user reward claim",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default UserRewardClaimsService;
