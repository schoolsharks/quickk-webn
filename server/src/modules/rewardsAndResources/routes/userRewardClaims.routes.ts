import express from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import * as userRewardClaimsController from '../controllers/userRewardClaims.controller';
import AdminService from '../../admin/service/admin.service';

const router = express.Router();
const imageUploadService = new AdminService();

// Apply for a reward (requires authentication and supports file upload)
router.post(
  '/apply',
  authenticateUser,
  imageUploadService.getS3Uploader('rewardClaims').any(),
  asyncHandler(userRewardClaimsController.applyForReward)
);


// Check if a specific reward type is claimed (requires authentication)
router.post(
  '/check-claimed',
  authenticateUser,
  asyncHandler(userRewardClaimsController.checkRewardClaimed)
);

// Check if a specific resource is claimed (requires authentication)
router.get(
  '/check-resource-claimed/:resourceId',
  authenticateUser,
  asyncHandler(userRewardClaimsController.checkResourceClaimed)
);



export default router;