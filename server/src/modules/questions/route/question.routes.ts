import express from 'express';
import * as questionControllers from "../controllers/question.controller";
import asyncHandeler from 'express-async-handler';
import { authenticateUser } from '../../../middlewares/authMiddleware';

const router = express.Router();

// router.get('/getQuestions', authenticateUser,asyncHandeler(questionControllers.getQuestions));
router.get('/getQuestion/:id', authenticateUser,asyncHandeler(questionControllers.getQuestionById));
router.post('/collectQuestionResponse', authenticateUser,asyncHandeler(questionControllers.collectQuestionResponse));


export default router;
