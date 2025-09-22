import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import InfoCardModel, { IInfoCard } from '../model/question.infoCard.model';
import QuestionInfoFeedback from '../model/question.infoFeedback';
import mongoose from 'mongoose';



class InfoCardService {
    async getAllInfoCards(infoCardIds: mongoose.Types.ObjectId[]) {
        try {
            const infoCards = await InfoCardModel.find( {_id: { $in: infoCardIds }});
            return infoCards;
        } catch (error) {
            throw new AppError('Error fetching info cards', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getInfoCardById(id: string) {
        try {
            const infoCard = await InfoCardModel.findById(id);
            if (!infoCard) {
                throw new AppError('Info card not found', StatusCodes.NOT_FOUND);
            }
            return infoCard;
        } catch (error) {
            throw new AppError('Error fetching info card', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }


    async collectFeedback(feedbackData: { user: mongoose.Types.ObjectId; feedback: string; infoCard: string }) {
        try {
            const { user, feedback, infoCard } = feedbackData;
            const infoCardResponse = await QuestionInfoFeedback.create({ user, feedback, infoCard });
            return infoCardResponse;
        } catch (error) {
            console.log('Error collecting feedback:', error);
            throw new AppError('Error collecting info card feedback', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserFeedbackForInfoCards(userId: mongoose.Types.ObjectId, questionIds: mongoose.Types.ObjectId[]) {
        try {
            const responses = await QuestionInfoFeedback.find({
                user: userId,
                infoCard: { $in: questionIds },
            });
            return responses;
        } catch (error) {
            throw new AppError('Error fetching user responses for InfoCard', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getFeedbackCountByInfocardId(InfocardId: mongoose.Types.ObjectId): Promise<number> {
            try {
                const count = await QuestionInfoFeedback.countDocuments(
                    // { question: InfocardId }
                );
                return count;
            } catch (error) {
                throw new AppError('Error fetching Feedback count', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

    async createInfoCard(infoCardData: Partial<IInfoCard>) {
        try {
            const infoCard = await InfoCardModel.create(infoCardData);
            return infoCard;
        } catch (error) {
            throw new AppError('Error creating info card', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateInfoCard(id: string, updateData: Partial<IInfoCard>) {
        try {
            const updatedInfoCard = await InfoCardModel.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!updatedInfoCard) {
                throw new AppError('Info card not found', StatusCodes.NOT_FOUND);
            }
            return updatedInfoCard;
        } catch (error) {
            throw new AppError('Error updating info card', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // async deleteInfoCard(id: string) {
    //     try {
    //         const deletedInfoCard = await InfoCardModel.findByIdAndDelete(id);
    //         if (!deletedInfoCard) {
    //             throw new AppError('Info card not found', StatusCodes.NOT_FOUND);
    //         }
    //     } catch (error) {
    //         throw new AppError('Error deleting info card', StatusCodes.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async cloneInfoCard(infoCardId: mongoose.Types.ObjectId): Promise<IInfoCard> {
        try {
            const originalInfoCard = await InfoCardModel.findById(infoCardId);
            if (!originalInfoCard) {
                throw new AppError('Info card not found', StatusCodes.NOT_FOUND);
            }

            // Create a copy of the info card without the _id and __v
            const infoCardData = originalInfoCard.toObject();
            const { _id, __v, ...cloneData } = infoCardData;

            const clonedInfoCard = await InfoCardModel.create(cloneData);
            return clonedInfoCard;
        } catch (error) {
            throw new AppError('Error cloning info card', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default InfoCardService ;

