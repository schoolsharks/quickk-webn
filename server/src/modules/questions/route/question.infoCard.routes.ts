import express from 'express';
import * as infoCardControllles from "../controllers/question.infoCard.controller";
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';

const router = express.Router();

router.get('/getInfoCards', authenticateUser,asyncHandeler(infoCardControllles.getInfoCards));
router.get('/getInfoCard/:id', authenticateUser,asyncHandeler(infoCardControllles.getInfoCardById));
router.post('/collectInfoCardFeedback', authenticateUser,asyncHandeler(infoCardControllles.collectInfoCardFeedback));

export default router;