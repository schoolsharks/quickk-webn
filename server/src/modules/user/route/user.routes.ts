import express from 'express';
import * as userAuthControllers from "../controllers/userAuth.controllers";
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import * as dailyPulseControllers from "../../dailyPulse/controllers/dailyPulse.controllers";
import * as learningControllers from "../../learning/controllers/learning.controller";
import * as moduleControllers from "../../learning/controllers/module.controller";
import * as userControllers from "../controllers/user.controller";
import * as rewardControllers from "../../reward/controllers/reward.controller";
import { eventController } from "../../events/controllers/events.controllers";
import * as UserControllers from "../../user/controllers/user.controller";
import * as userConnectionControllers from "../controllers/user.connection.controller";
import userRewardClaimsRoutes from "../../rewardsAndResources/routes/userRewardClaims.routes";
import resourcesRoutes from "../../rewardsAndResources/routes/resources.routes";
import userConnectionFeedbackRoutes from "./user.connection.feedback.routes";

const router = express.Router();

router.post('/login', asyncHandeler(userAuthControllers.login));
router.post('/logout', asyncHandeler(userAuthControllers.logout));
router.post('/sendOtp', asyncHandeler(userAuthControllers.sendOtp));
router.post('/resendOtp', asyncHandeler(userAuthControllers.resendOtp));
router.post('/verifyOtp', asyncHandeler(userAuthControllers.verifyOtp));
router.post('/signup', asyncHandeler(userAuthControllers.signup));
router.post('/refresh', asyncHandeler(userAuthControllers.refreshToken));


router.get('/fetchUser', authenticateUser, asyncHandeler(userAuthControllers.getUser));
router.get('/getAllAvatars', authenticateUser, asyncHandeler(userControllers.getAllAvatars));
router.post('/selectAvatar', authenticateUser, asyncHandeler(userControllers.selectAvatar));

router.get('/getDailyPulse', authenticateUser, asyncHandeler(dailyPulseControllers.getDailyPulses));
router.post('/submitPulseResponse', authenticateUser, asyncHandeler(dailyPulseControllers.submitPulseResponse));

router.get('/getLearning', authenticateUser, asyncHandeler(learningControllers.getLearningByWeek));
router.get('/getModule/:id', authenticateUser, asyncHandeler(moduleControllers.getModuleById));
router.get('/getAssessmentQuestions/:id', authenticateUser, asyncHandeler(moduleControllers.getAssessmentQuestions));
router.post('/submitLearningResponse', authenticateUser, asyncHandeler(moduleControllers.submitLearningResponse));
router.post('/checkQuestionResponse', authenticateUser, asyncHandeler(moduleControllers.checkQuestionResponse));
router.get('/getModuleComplete/:currentModuleId', authenticateUser, asyncHandeler(moduleControllers.getModuleComplete));
router.post('/markModuleCompleted', authenticateUser, asyncHandeler(moduleControllers.markModuleCompletedIfAssessmentAnswered));
router.post('/markVideoCompleted', authenticateUser, asyncHandeler(moduleControllers.markVideoCompleted));


router.get('/getLeaderboard', authenticateUser, asyncHandeler(userControllers.getAllUsersWithDetails));
router.get('/getAllRewards', authenticateUser, asyncHandeler(rewardControllers.getAllRewards));
router.get('/getUserTickets', authenticateUser, asyncHandeler(rewardControllers.getAllTickets));
router.get('/getLiveReward/:rewardId', authenticateUser, asyncHandeler(rewardControllers.getLiveReward));
router.post('/buyTicket', authenticateUser, asyncHandeler(rewardControllers.buyTicket));
router.get('/getUpcomingReward', authenticateUser, asyncHandeler(rewardControllers.getUpcomingReward));
router.get('/getWinnerTicket/:rewardId', authenticateUser, asyncHandeler(rewardControllers.getWinnerTicket));
router.get('/getLastPastReward', authenticateUser, asyncHandeler(rewardControllers.getLastPastReward));

//Mission Million Route 
router.get('/getMissionMillion', authenticateUser, asyncHandeler(learningControllers.getTotalLearningTimeForAllUsers));

//Routes for events 
router.get('/getActiveEvents', authenticateUser, asyncHandeler(eventController.getActiveEvents));
router.get('/getUpcomingEvents', authenticateUser, asyncHandeler(eventController.getUpcomingEvents));
router.get('/getPastEvents', authenticateUser, asyncHandeler(eventController.getPastEvents));
router.get('/getEventById/:eventId', authenticateUser, asyncHandeler(eventController.getEventById));

// route for user profile
router.post('/updateUserProfile', authenticateUser, asyncHandeler(UserControllers.addEditUser));

// route for searching network users
router.get('/search/users', authenticateUser, asyncHandeler(UserControllers.searchUsers));

// route for getting user recommendations
router.get('/getRecommendations', authenticateUser, asyncHandeler(UserControllers.getUserRecommendations));

// Connection routes
router.post('/addConnection', authenticateUser, asyncHandeler(userConnectionControllers.addConnection));
router.get('/getConnections', authenticateUser, asyncHandeler(userConnectionControllers.getUserConnections));

// Routes for user reward claims
router.use('/reward-claims', userRewardClaimsRoutes);

// Routes for resources
router.use('/resources', resourcesRoutes);

// Routes for connection feedback
router.use('/connection-feedback', userConnectionFeedbackRoutes);

// router.post('/requestPasswordReset', asyncHandeler(authControllers.requestPasswordReset));
// router.post('/resetPassword', asyncHandeler(authControllers.resetPassword));
// router.post('/resendOTP', asyncHandeler(authControllers.resendOTP));


export default router;
