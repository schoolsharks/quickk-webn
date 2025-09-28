import express from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser, authorizeRoles } from '../../../middlewares/authMiddleware';
import * as resourcesController from '../controllers/resources.controller';
import AdminService from '../../admin/service/admin.service';

const router = express.Router();
const imageUploadService = new AdminService();

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

// Admin: Get resources stats
router.get(
  '/admin/stats',
  authenticateUser,
  authorizeRoles('ADMIN'),
  asyncHandler(resourcesController.getResourcesStats)
);

// Admin: Search resources with pagination
router.get(
  '/admin/search',
  authenticateUser,
  authorizeRoles('ADMIN'),
  asyncHandler(resourcesController.searchResources)
);

// Admin: Create new resource
router.post(
  '/admin/create',
  authenticateUser,
  authorizeRoles('ADMIN'),
  imageUploadService.getS3Uploader('resources').any(),
  asyncHandler(resourcesController.createResource)
);

// Admin: Update resource
router.put(
  '/admin/:resourceId',
  authenticateUser,
  authorizeRoles('ADMIN'),
  imageUploadService.getS3Uploader('resources').any(),
  asyncHandler(resourcesController.updateResource)
);

// Admin: Delete resource
router.delete(
  '/admin/:resourceId',
  authenticateUser,
  authorizeRoles('ADMIN'),
  asyncHandler(resourcesController.deleteResource)
);

// Admin: Search companies from users
router.get(
  '/admin/companies/search',
  authenticateUser,
  authorizeRoles('ADMIN'),
  asyncHandler(resourcesController.searchCompanies)
);

export default router;