import express from 'express';
import * as adminControllers from "../../admin/controllers/admin.controllers";
import asyncHandeler from 'express-async-handler';
import { authenticateUser, authorizeRoles } from '../../../middlewares/authMiddleware';
import * as DailyPulseControllers from "../../dailyPulse/controllers/dailyPulse.controllers"
import * as LearningControllers from "../../learning/controllers/learning.controller"
import * as ModuleControllers from "../../learning/controllers/module.controller"
import * as QuickkAiControllers from "../../quickkAi/controllers/quickkAi.controller"
import * as UserControllers from "../../user/controllers/user.controller"
import { eventController } from "../../events/controllers/events.controllers"
import AdminService from '../service/admin.service';

const imageUploadService = new AdminService();

const router = express.Router();
router.post(
    '/registerUser',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.registerUser)
);
router.post(
    '/registerCompanyWithAdmin',
    asyncHandeler(adminControllers.registerCompanyWithAdmin)
);

router.post(
    '/registerAdmin',
    asyncHandeler(adminControllers.registerAdmin)
);

router.post(
    '/login',
    asyncHandeler(adminControllers.login)
);
router.post(
    '/logout',
    asyncHandeler(adminControllers.logout)
);

router.post(
    '/refresh',
    asyncHandeler(adminControllers.refreshAdminToken)
);
router.post(
    '/checkAdminEmailExists',
    asyncHandeler(adminControllers.checkAdminEmailExists)
);

router.get(
    '/fetchAdmin',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getAdminById)
);

router.post(
    '/verifyAdminOtp',
    asyncHandeler(adminControllers.verifyAdminOtp)
);

router.post(
    '/resendAdminOtp',
    asyncHandeler(adminControllers.resendAdminOtp)
);

router.get(
    '/getDashboardStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getDashboardStats)
);

router.get(
    '/getEngagementAnalytics',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getEngagementAnalytics)
);

router.get(
    '/getParticipationLeaderboard',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getParticipationLeaderboard)
);

router.get(
    '/referral/stats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getReferralStats)
);

router.get(
    '/referral/users',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getReferralUsers)
);

router.patch(
    '/referral/:claimId/advertised',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.markReferralAdvertisementDisplayed)
);

router.get(
    '/referral/advertisement/available-dates',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getAvailableAdvertisementDates)
);

router.post(
    '/referral/advertisement/add-to-pulse',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.addAdvertisementToDailyPulse)
);


// Daily Pulse Route
router.get(
    '/getDailyPulseTable',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.getAllDailyPulsesWithStatus)
);
router.post(
    '/updateDailyPulse',
    authenticateUser,
    authorizeRoles('ADMIN'),
    imageUploadService.getS3Uploader('dailyPulse').any(),
    asyncHandeler(DailyPulseControllers.updateDailyPulse)
);

router.post(
    '/createBlankDailyPulse',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.createBlankDailyPulse)
);
router.get(
    '/getDailyPulseById/:dailyPulseId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.getDailyPulseById)
);

router.delete(
    '/deleteDailyPulseById',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.deleteDailyPulseById)
);
router.put(
    '/archievedailyPulseById/:dailyPulseId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.archievedailyPulseById)
);
router.post(
    '/cloneDailyPulseById/:dailyPulseId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.cloneDailyPulseById)
);
router.get(
    '/downloadDailyPulseReport/:dailyPulseId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.downloadDailyPulseReport)
);
router.post(
    '/createAIDailyPulse',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.createAIDailyPulse)
);


router.get(
    '/getDailyPulseStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.getDailyPulseStats)
);

router.get(
    '/getTodayDailyPulseEngagement',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.getTodayDailyPulseEngagement)
);


//Learning Routes
router.get(
    '/getLearningTableData',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.getLearningTableData)
);
router.post(
    '/updateLearningWithModules',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.updateLearningWithModules)
);

router.post(
    '/updateModule',
    authenticateUser,
    authorizeRoles('ADMIN'),
    imageUploadService.getS3Uploader('modules').any(),
    asyncHandeler(ModuleControllers.updateModule)
);


router.get(
    '/publishLearning/:learningId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.publishLearningIfAllModulesCompleted)
);
router.get(
    '/createBlankLearning',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.createBlankLearning)
);
router.get(
    '/getLearningById/:learningId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.getLearningById)
);
router.get(
    '/getCompleteModuleById/:moduleId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(ModuleControllers.getCompleteModuleById)
);
router.put(
    '/deleteLearningById',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.deleteLearningById)
);
router.put(
    '/archieveLearningById/:learningId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.archieveLearningById)
);
router.post(
    '/createBlankModule',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(ModuleControllers.createBlankModule)
);
router.put(
    '/deleteModuleById',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(ModuleControllers.deleteModuleById)
);

router.post(
    '/createAIModule',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.createAIModule)
);
router.get(
    '/getLearningStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.getLearningStats)
);

router.get(
    '/getLearningTitles',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.getLearningTitles)
);

// User Routes for admin to fetch user details

router.get(
    '/getAllUsersTableData',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.getAllUsersTableData)
);

router.post(
    '/addEditUser',
    authenticateUser,
    authorizeRoles('ADMIN'),
    imageUploadService.getS3Uploader('userLogos').any(),
    asyncHandeler(UserControllers.addEditUser)
);

router.post(
    '/bulkUploadUsers',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.bulkUploadUsers)
);

router.get(
    '/getUserById/:userId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.getUserById)
);

router.post(
    '/createBlankUser',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.createBlankUser)
);

router.delete(
    '/deleteUserById/:userId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.deleteUserById)
);

router.put(
    '/moveUserToWebn:userId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.moveUserToWebn)
);

router.get(
    '/getActiveUsersStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.getActiveUsersStats)
);

// Routes for Quickk Ai Messaages :
router.post('/createChat',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.createChat)
);
router.get('/chat/search',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.searchChats)
);
router.get('/chat/:chatId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.getChatById)
);
router.get('/chat',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.getChatsByAdmin)
);
router.put('/chat/:chatId/messages',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.updateChatMessages)
);
router.put('/chat/:chatId/completion',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.updateChatOnCompletion)
);
router.post('/chat/:chatId/messages',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.addMessageToChat)
);
router.delete('/chat/deleteChatById/:chatId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.deleteChat)
);
router.post('/chat/createNewChat',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.createNewChat)
);

router.post(
    '/improveEventDescription',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(QuickkAiControllers.improveEventDescription)
);

// Search endpoints 
router.get('/search/users',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(UserControllers.searchUsers)
);
router.get('/search/dailyPulse',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(DailyPulseControllers.searchDailyPulses)
);
router.get('/search/learning',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(LearningControllers.searchLearning)
);

// Events Routes for Admin
router.get(
    '/getAdminEventStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.getAdminEventStats)
);

router.get(
    '/getAllEventsAdmin',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.getAllEventsAdmin)
);

router.get(
    '/searchEventsAdmin',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.searchEventsAdmin)
);

router.post(
    '/createEvent',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.createEvent)
);

router.post(
    '/createBlankEvent',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.createBlankEvent)
);

router.get(
    '/getEvent/:eventId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.getEventById)
);

router.put(
    '/updateEvent/:eventId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    imageUploadService.getS3Uploader('events').any(),
    asyncHandeler(eventController.updateEvent)
);

router.delete(
    '/deleteEvent/:eventId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.deleteEvent)
);

router.post(
    '/cloneEvent/:eventId',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.cloneEvent)
);

router.get(
    '/searchAddresses',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(eventController.searchAddresses)
);

// Connection Analytics Routes for Admin Dashboard
router.get(
    '/getConnectionStats',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.getConnectionStats)
);

router.get(
    '/exportConnections',
    authenticateUser,
    authorizeRoles('ADMIN'),
    asyncHandeler(adminControllers.exportConnections)
);


export default router;