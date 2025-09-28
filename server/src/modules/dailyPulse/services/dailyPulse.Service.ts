import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";
import { generateTodayDate } from "../../../utils/generateTodayDate";
import DailyPulse, { IDailyPulse } from "../model/dailyPulse.model";
import { Status, PulseType } from "../types/enum";
import { Types } from "mongoose";
import QuestionService from "../../questions/service/question.service";
import InfoCardService from "../../questions/service/question.infoCard.service";
import { QuestionType } from "../../questions/types/enum";
import UserRewardClaimsService from "../../rewardsAndResources/services/userRewardClaims.service";
import { RewardTypes } from "../../rewardsAndResources/types/enums";
import UserService from "../../user/service/user.service";

const userRewardClaimsService = new UserRewardClaimsService();
const questionService = new QuestionService();
const userService = new UserService();

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

    async getAvailableAdvertisementDates(companyId: string): Promise<Date[]> {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone issues

            // Get all daily pulses for this company from today onwards
            const dailyPulses = await DailyPulse.find({
                company: new Types.ObjectId(companyId),
                publishOn: { $gte: today },
                status: { $ne: Status.Archived }
            }).select('publishOn pulses');

            const questionService = new QuestionService();
            const availableDates: Date[] = [];

            // Generate the next 30 days from today
            for (let i = 0; i < 30; i++) {
                const currentDate = new Date(today);
                currentDate.setUTCDate(today.getUTCDate() + i); // Use UTC methods

                // Check if there's a daily pulse for this date
                const dailyPulseForDate = dailyPulses.find(pulse => {
                    const pulseDate = new Date(pulse.publishOn);
                    const pulseDateStr = pulseDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
                    const currentDateStr = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
                    return pulseDateStr === currentDateStr;
                });

                if (dailyPulseForDate) {
                    // Check if this daily pulse already has an advertisement question
                    let hasAdvertisement = false;

                    for (const pulse of dailyPulseForDate.pulses) {
                        if (pulse.type === PulseType.Question) {
                            try {
                                const question = await questionService.getQuestionById(pulse.refId.toString());
                                if (question.qType === QuestionType.ADVERTISEMENT) {
                                    hasAdvertisement = true;
                                    break;
                                }
                            } catch (error) {
                                // If question not found, skip
                                continue;
                            }
                        }
                    }

                    // If no advertisement found, date is available
                    if (!hasAdvertisement) {
                        availableDates.push(currentDate);
                    }
                } else {
                    // No daily pulse exists for this date, so it's available
                    availableDates.push(currentDate);
                }
            }

            return availableDates;
        } catch (error) {
            console.error(error);
            throw new AppError('Failed to get available advertisement dates', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async addAdvertisementToDailyPulse(companyId: string, userId: string, selectedDate: Date): Promise<IDailyPulse> {
        try {
            // Get user's advertisement claim
            const user = await userService.getUserById(new Types.ObjectId(userId));
            if (!user) {
                throw new AppError('User not found', StatusCodes.NOT_FOUND);
            }

            // Find user's advertisement reward claim
            const advertisementClaim = await userRewardClaimsService.getUserRewardClaim(
                new Types.ObjectId(userId),
                RewardTypes.ADVERTISEMENT
            );

            if (!advertisementClaim) {
                throw new AppError('User has no advertisement claim', StatusCodes.NOT_FOUND);
            }

            // Create advertisement question with business name and logo
            const advertisementQuestion = await questionService.createQuestion({
                qType: QuestionType.ADVERTISEMENT,
                questionText: user.businessName || 'Business Advertisement',
                image: advertisementClaim.advertisementBannerUrl,
                options: [], // Advertisement questions don't need options
                correctAnswer: '', // Advertisement questions don't need correct answer
                score: 10 // Advertisement questions don't give stars
            });

            // Use the selectedDate as-is (already parsed in controller)

            // Ensure the date is at start of day
            const targetDate = new Date(selectedDate);
            targetDate.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

            // Check if daily pulse exists for the selected date using date range

            // Create date range for the entire day
            const startOfDay = new Date(targetDate);
            const endOfDay = new Date(targetDate);
            endOfDay.setUTCDate(endOfDay.getUTCDate() + 1); // Next day

            let dailyPulse = await DailyPulse.findOne({
                company: new Types.ObjectId(companyId),
                publishOn: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            });

            if (dailyPulse) {
                // Add advertisement question to existing daily pulse
                dailyPulse.pulses.push({
                    refId: advertisementQuestion._id as Types.ObjectId,
                    type: PulseType.Question
                });
                await dailyPulse.save();
            } else {
                // Create new daily pulse with advertisement question
                dailyPulse = new DailyPulse({
                    publishOn: targetDate,
                    pulses: [{
                        refId: advertisementQuestion._id as Types.ObjectId,
                        type: PulseType.Question
                    }],
                    stars: 0,
                    status: Status.Drafts,
                    company: new Types.ObjectId(companyId)
                });
                await dailyPulse.save();
            }

            return dailyPulse;
        } catch (error) {
            console.error(error);
            throw new AppError('Failed to add advertisement to daily pulse', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

}

export default DailyPulseService;