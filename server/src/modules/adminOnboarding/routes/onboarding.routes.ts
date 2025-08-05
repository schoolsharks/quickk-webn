import express from 'express';
import * as OnboardingControllers from '../controllers/onboarding.controller';
import { authenticateUser, authorizeRoles } from '../../../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.post('/complete', OnboardingControllers.completeOnboarding);
router.get('/features', OnboardingControllers.getAllFeatures);

// Protected routes (require admin authentication)
router.get('/company-features',
    authenticateUser,
    authorizeRoles('ADMIN'),
    OnboardingControllers.getCompanyFeatures);

export default router;