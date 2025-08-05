import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import QuestionService from '../service/question.service';
import AppError from '../../../utils/appError';

const questionService = new QuestionService();

// Controller to get all questions
// export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const questions = await questionService.getAllQuestions();
//         res.status(StatusCodes.OK).json({ success: true, data: questions });
//     } catch (error) {
//         next(error);
//     }
// };

// Controller to get a single question by ID
export const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const question = await questionService.getQuestionById(id);

        if (!question) {
            return next(new AppError('Question not found', StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({ success: true, data: question });
    } catch (error) {
        next(error);
    }
};

// Controller to collect a question response
export const collectQuestionResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user?.id; 
        const {  question, response } = req.body;

        if (!user || !question || !response) {
            return next(new AppError('All fields (user, question, response) are required', StatusCodes.BAD_REQUEST));
        }

        const questionResponse = await questionService.collectResponse({ user, question, response ,starsAwarded: 0});

        res.status(StatusCodes.CREATED).json({ success: true, data: questionResponse });
    } catch (error) {
        next(error);
    }
};