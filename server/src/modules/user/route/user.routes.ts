import express from 'express';
import * as userAuthControllers from "../controllers/userAuth.controllers";
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import * as dailyPulseControllers from "../../dailyPulse/controllers/dailyPulse.controllers";
import * as learningControllers from "../../learning/controllers/learning.controller";
import * as moduleControllers from "../../learning/controllers/module.controller";
import * as userControllers from "../controllers/user.controller";
import * as rewardControllers from "../../reward/controllers/reward.controller";

const router = express.Router();

router.post('/login', asyncHandeler(userAuthControllers.login));
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


// router.post('/requestPasswordReset', asyncHandeler(authControllers.requestPasswordReset));
// router.post('/resetPassword', asyncHandeler(authControllers.resetPassword));
// router.post('/resendOTP', asyncHandeler(authControllers.resendOTP));


export default router;
