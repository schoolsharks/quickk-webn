import express from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import * as resourcesController from '../controllers/resources.controller';

const router = express.Router();

// Fetch all resources (requires authentication)
router.get(
  '/',
  authenticateUser,
  asyncHandler(resourcesController.fetchAllResources)
);

// Fetch specific resource by ID (requires authentication)
router.get(
  '/:resourceId',
  authenticateUser,
  asyncHandler(resourcesController.fetchResourceById)
);

export default router;