import express from 'express';
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import * as userConnectionFeedbackControllers from "../controllers/user.connection.feedback.controller";

const router = express.Router();

// Get connection feedback for daily pulse
router.get('/getConnectionFeedbackPulse', authenticateUser, asyncHandeler(userConnectionFeedbackControllers.getConnectionFeedbackForPulse));

// Submit connection feedback response
router.post('/submitConnectionFeedbackResponse', authenticateUser, asyncHandeler(userConnectionFeedbackControllers.submitConnectionFeedbackResponse));

// Get user's connection feedback history
router.get('/getConnectionFeedbacks', authenticateUser, asyncHandeler(userConnectionFeedbackControllers.getUserConnectionFeedbacks));

// Get connection feedback by ID
router.get('/getConnectionFeedback/:feedbackId', authenticateUser, asyncHandeler(userConnectionFeedbackControllers.getConnectionFeedbackById));

export default router;