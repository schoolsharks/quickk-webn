import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import UserRewardClaimsService from '../services/userRewardClaims.service';
import { RewardTypes } from '../types/enums';

const userRewardClaimsService = new UserRewardClaimsService();

export const applyForReward = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    let rewardType: string;
    let advertisementBannerUrl: string | undefined;
    let resourceId: string | undefined;
    let userInput: string | undefined;

    // Check if request contains files (FormData) or is JSON
    const hasFiles = req.files && Array.isArray(req.files) && req.files.length > 0;

    if (hasFiles) {
      // Handle FormData request with file uploads (for ADVERTISEMENT type)
      rewardType = req.body.rewardType;
      resourceId = req.body.resourceId;
      userInput = req.body.userInput;

      // Find advertisement banner file if uploaded
      const bannerFile = (req.files as Express.MulterS3.File[]).find(
        (file: Express.MulterS3.File) => file.fieldname === "advertisementBanner"
      );

      if (bannerFile) {
        advertisementBannerUrl = bannerFile.location; // S3 URL from multer-s3
      }
    } else {
      // Handle regular JSON request (for RESOURCES type)
      rewardType = req.body.rewardType;
      resourceId = req.body.resourceId;
      userInput = req.body.userInput;
    }

    // Validate reward type
    if (!rewardType || !Object.values(RewardTypes).includes(rewardType as RewardTypes)) {
      return next(
        new AppError(
          `Invalid reward type. Must be one of: ${Object.values(RewardTypes).join(', ')}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Additional validation for RESOURCES type
    if (rewardType === RewardTypes.RESOURCES) {
      if (!resourceId) {
        return next(
          new AppError('Resource ID is required for resource claims', StatusCodes.BAD_REQUEST)
        );
      }
      if (!userInput || !userInput.trim()) {
        return next(
          new AppError('User input is required for resource claims', StatusCodes.BAD_REQUEST)
        );
      }
    }

    const result = await userRewardClaimsService.applyForReward(
      userId, 
      rewardType as RewardTypes, 
      advertisementBannerUrl,
      resourceId,
      userInput
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Reward application submitted successfully',
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in applyForReward controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};


export const checkRewardClaimed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { rewardType } = req.body;

    // Validate reward type
    if (!rewardType || !Object.values(RewardTypes).includes(rewardType)) {
      return next(
        new AppError(
          `Invalid reward type. Must be one of: ${Object.values(RewardTypes).join(', ')}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const isClaimed = await userRewardClaimsService.isRewardClaimed(userId, rewardType);

    res.status(StatusCodes.OK).json({
      success: true,
      claimed: isClaimed,
      rewardType: rewardType
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in checkRewardClaimed controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const checkResourceClaimed = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { resourceId } = req.params;

    if (!resourceId) {
      return next(
        new AppError('Resource ID is required', StatusCodes.BAD_REQUEST)
      );
    }

    const isClaimed = await userRewardClaimsService.isResourceClaimed(userId, resourceId);

    res.status(StatusCodes.OK).json({
      success: true,
      claimed: isClaimed,
      resourceId: resourceId
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in checkResourceClaimed controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};