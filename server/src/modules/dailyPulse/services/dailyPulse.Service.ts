import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";
import { generateTodayDate } from "../../../utils/generateTodayDate";
import DailyPulse, { IDailyPulse } from "../model/dailyPulse.model";
import { Status, PulseType } from "../types/enum";
import { Types } from "mongoose";
import QuestionService from "../../questions/service/question.service";
import InfoCardService from "../../questions/service/question.infoCard.service";

class DailyPulseService {
    async createBlankDailyPulse(companyId: string): Promise<string> {
        try {
            const dailyPulse = new DailyPulse({
                publishOn: generateTodayDate(),
                pulses: [],
                stars: 0,
                status: Status.Drafts,
                company: new Types.ObjectId(companyId),
            });
            await dailyPulse.save();
            return dailyPulse._id as string;
        } catch (error) {
            throw new AppError('Error creating blank daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async updateDailyPulse(dailyPulseId: string, updateData: Partial<IDailyPulse>): Promise<IDailyPulse | null> {
        try {
            const updatedPulse = await DailyPulse.findByIdAndUpdate(
                dailyPulseId,
                updateData,
                { new: true, runValidators: true }
            );
            if (!updatedPulse) {
                throw new AppError('Daily pulse not found', StatusCodes.NOT_FOUND);
            }
            return updatedPulse;
        } catch (error) {
            throw new AppError('Error updating daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getDailyPulseById(dailyPulseId: string): Promise<IDailyPulse | null> {
        try {
            const dailyPulse = await DailyPulse.findById(dailyPulseId);
            if (!dailyPulse) {
                throw new AppError('Daily pulse not found', StatusCodes.NOT_FOUND);
            }
            return dailyPulse;
        } catch (error) {
            throw new AppError('Error fetching daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteDailyPulseById(dailyPulseId: string): Promise<void> {
        try {
            const deletedPulse = await DailyPulse.findByIdAndDelete(dailyPulseId);
            if (!deletedPulse) {
                throw new AppError('Daily pulse not found', StatusCodes.NOT_FOUND);
            }
        } catch (error) {
            throw new AppError('Error deleting daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllDailyPulses(companyId: string): Promise<IDailyPulse[]> {
        try {
            const dailyPulses = await DailyPulse.find({ company: companyId });
            return dailyPulses;
        } catch (error) {
            throw new AppError('Error fetching all daily pulses', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async archieveDailyPulseById(dailyPulseId: string) {
        try {
            const dailyPulse = await DailyPulse.findByIdAndUpdate(dailyPulseId, {
                status: Status.Archived
            });
            if (!dailyPulse) {
                throw new AppError('DailyPulse not found', StatusCodes.NOT_FOUND);
            }
            return { message: 'DailyPulse Archieved successfully' };
        } catch (error) {
            console.error(error);
            throw new AppError('Failed to archieve DailyPulse.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async cloneDailyPulseById(dailyPulseId: string, companyId: string): Promise<string> {
        try {
            const originalDailyPulse = await DailyPulse.findById(dailyPulseId);
            if (!originalDailyPulse) {
                throw new AppError('Daily pulse not found', StatusCodes.NOT_FOUND);
            }

            // Initialize services
            const questionService = new QuestionService();
            const infoCardService = new InfoCardService();

            // Clone all pulses (questions and info cards)
            const clonedPulses = await Promise.all(
                originalDailyPulse.pulses.map(async (pulse) => {
                    if (pulse.type === PulseType.Question) {
                        const clonedQuestion = await questionService.cloneQuestion(pulse.refId);
                        return {
                            refId: clonedQuestion._id,
                            type: pulse.type
                        };
                    } else if (pulse.type === PulseType.InfoCard) {
                        const clonedInfoCard = await infoCardService.cloneInfoCard(pulse.refId);
                        return {
                            refId: clonedInfoCard._id,
                            type: pulse.type
                        };
                    }
                    return pulse; // fallback for other types
                })
            );

            // Create new daily pulse with cloned data
            const clonedDailyPulse = new DailyPulse({
                publishOn: null, // Empty publish date as requested
                pulses: clonedPulses,
                stars: originalDailyPulse.stars, // Same stars as original
                status: Status.Drafts, // Set to draft
                company: new Types.ObjectId(companyId), // Same company
            });

            await clonedDailyPulse.save();
            return clonedDailyPulse._id as string;
        } catch (error) {
            console.error(error);
            throw new AppError('Failed to clone daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    




}

export default DailyPulseService;