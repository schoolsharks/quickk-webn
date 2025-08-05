import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import InfoCardService from '../service/question.infoCard.service';

const infoCardService = new InfoCardService();

// Controller to get all info cards
export const getInfoCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { infoCardIds } = req.body;
        const infoCards = await infoCardService.getAllInfoCards(infoCardIds);
        res.status(StatusCodes.OK).json({ success: true, data: infoCards });
    } catch (error) {
        next(error);
    }
};

// Controller to get a single info card by ID
export const getInfoCardById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const infoCard = await infoCardService.getInfoCardById(id);

        if (!infoCard) {
            return next(new AppError('InfoCard not found', StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({ success: true, data: infoCard });
    } catch (error) {
        next(error);
    }
};


// Controller to collect feedback for an info card
export const collectInfoCardFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { user, feedback, infoCard } = req.body;

        if (!user || !feedback || !infoCard) {
            return next(new AppError('All fields (user, feedback, infoCard) are required', StatusCodes.BAD_REQUEST));
        }

        const infoCardDetails = await infoCardService.getInfoCardById(infoCard);

        if (!infoCardDetails) {
            return next(new AppError('InfoCard not found', StatusCodes.NOT_FOUND));
        }

        if (!infoCardDetails.wantFeedback) {
            return next(new AppError('Feedback is not enabled for this InfoCard', StatusCodes.BAD_REQUEST));
        }

        const feedbackResponse = await infoCardService.collectFeedback({ user, feedback, infoCard });

        res.status(StatusCodes.CREATED).json({ success: true, data: feedbackResponse });
    } catch (error) {
        next(error);
    }
};