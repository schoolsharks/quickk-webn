import express from 'express';
import * as adminControllers from "../../admin/controllers/admin.controllers";
import asyncHandeler from 'express-async-handler';
import { authenticateUser, authorizeRoles } from '../../../middlewares/authMiddleware';
import * as DailyPulseControllers from "../../dailyPulse/controllers/dailyPulse.controllers"
import * as LearningControllers from "../../learning/controllers/learning.controller"
import * as ModuleControllers from "../../learning/controllers/module.controller"
import * as QuickkAiControllers from "../../quickkAi/controllers/quickkAi.controller"
import * as UserControllers from "../../user/controllers/user.controller"
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
    asyncHandeler(UserControllers.addEditUser)
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

export default router;