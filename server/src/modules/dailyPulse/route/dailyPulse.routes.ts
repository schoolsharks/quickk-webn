import express from 'express';
import * as dailyPulseControllers from "../controllers/dailyPulse.controllers";
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';

const router = express.Router();

router.get('/getDailyPulse', authenticateUser,asyncHandeler(dailyPulseControllers.getDailyPulses));


export default router;
