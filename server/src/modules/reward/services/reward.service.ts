import mongoose from 'mongoose';
import Reward from '../models/reward.model';
import Ticket from '../models/ticket.model';
import { RewardStatus, TicketStatus } from '../types/enums';
import { generateTicketCode } from '../../../utils/generateTicketCode';
import UserService from '../../user/service/user.service';

class RewardService {
    async getAllRewards(companyId: string) {
        try {
            const rewards = await Reward.find({ company: companyId });
            const live = rewards.filter((reward) => reward.status === 'live');
            const upcoming = rewards.filter((reward) => reward.status === 'upcoming');

            const liveRewards = live.map((live) => ({
                image: live.image,
                resultTime: live.endTime,
                ticketCost: live.price,
                id: live._id,
            }));

            const upcomingRewards = upcoming.map((reward) => ({
                image: reward.image,
                title: reward.name,
                ticketCost: reward.price,
                id: reward._id,
            }));

            return {
                liveRewards,
                upcomingRewards,
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch rewards: ${error.message}`);
        }
    }


    async getAllTickets(userId: mongoose.Types.ObjectId) {
        try {
            const tickets = await Ticket.aggregate([
                {
                    $match: { user: new mongoose.Types.ObjectId(userId) },
                },
                {
                    $lookup: {
                        from: 'rewards',
                        localField: 'reward',
                        foreignField: '_id',
                        as: 'rewardDetails',
                    },
                },
                {
                    $unwind: '$rewardDetails',
                },
                {
                    $project: {
                        tokenNumber: 1,
                        ticketCode: 1,
                        status: 1,
                        price: '$rewardDetails.price',
                        rewardImage: '$rewardDetails.image',
                        rewardStatus: '$rewardDetails.status',
                    },
                },
            ]);


            const currentTickets = tickets.filter(ticket => ticket.rewardStatus === 'live');
            const pastTickets = tickets.filter(ticket => ticket.rewardStatus === 'past');

            return {
                currentTickets,
                pastTickets,
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch tickets for user ${userId}: ${error.message}`);
        }
    }

    async getLiveReward(rewardId: string) {
        try {
            // Validate ObjectId before creating it
            if (!mongoose.Types.ObjectId.isValid(rewardId)) {
                throw new Error('Invalid reward ID format');
            }

            const id = new mongoose.Types.ObjectId(rewardId);

            const liveRewardDetails = await Reward.findOne({
                _id: id,
                status: RewardStatus.LIVE
            });

            if (!liveRewardDetails) {
                throw new Error('Live reward not found');
            }

            // Get the count of participants (tickets purchased for this reward)
            const participantCount = await Ticket.countDocuments({ reward: id });
            const liveReward = { ...liveRewardDetails.toObject(), participantCount };

            return {
                liveReward
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch live reward at service: ${error.message}`);
        }
    }

    async buyTicket(userId: mongoose.Types.ObjectId, rewardId: string, quantity: number = 1) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const reward = await Reward.findOne({
                _id: rewardId,
                status: RewardStatus.LIVE
            }).session(session);

            if (!reward) {
                throw new Error('Live reward not found or not available for purchase');
            }

            const totalCost = reward.price * quantity;
            const userService = new UserService();
            await userService.deductStars(userId, totalCost, session);

            const tickets = [];

            const rewardImage = await Reward.findById(rewardId).select('image').lean();

            // Fetch the last ticket's tokenNumber for this reward
            const lastTicket = await Ticket.findOne({ reward: rewardId })
                .sort({ tokenNumber: -1 })
                .session(session)
                .lean();
            let nextTokenNumber = lastTicket ? lastTicket.tokenNumber + 1 : 100;

            for (let i = 0; i < quantity; i++) {
                const ticketCode = generateTicketCode();

                const newTicket = new Ticket({
                    status: TicketStatus.AWAITED,
                    reward: rewardId,
                    user: userId,
                    ticketCode,
                    tokenNumber: nextTokenNumber++
                });

                const savedTicket = await newTicket.save({ session });
                tickets.push({ ...savedTicket.toObject(), rewardImage: rewardImage?.image });
            }

            await session.commitTransaction();
            session.endSession();

            return {
                success: true,
                message: `Successfully purchased ${quantity} ticket(s)`,
                tickets
            };
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(`Failed to purchase ticket: ${error.message}`);
        }
    }



    async getUpcomingReward() {
        try {
            const upcomingReward = await Reward.findOne({ status: RewardStatus.UPCOMING })
                .sort({ startTime: 1 })
                .lean();

            if (!upcomingReward) {
                throw new Error('No upcoming reward found');
            }

            return { upcomingReward };
        } catch (error: any) {
            throw new Error(`Failed to fetch upcoming reward: ${error.message}`);
        }
    }


    async updateWinnerTicket(tokenNumber: number, rewardId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(rewardId)) {
                throw new Error('Invalid reward ID format');
            }
            const rewardObjectId = new mongoose.Types.ObjectId(rewardId);

            // Update winner ticket
            const winnerTicket = await Ticket.findOneAndUpdate(
                { tokenNumber, reward: rewardObjectId },
                { status: TicketStatus.WIN },
                { new: true, session }
            );
            if (!winnerTicket) {
                throw new Error('Winner ticket not found');
            }

            // Update all other tickets to LOOSE
            await Ticket.updateMany(
                { reward: rewardObjectId, tokenNumber: { $ne: tokenNumber } },
                { status: TicketStatus.LOOSE },
                { session }
            );

            // Update reward status to PAST
            await Reward.findByIdAndUpdate(
                rewardObjectId,
                { status: RewardStatus.PAST },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return { success: true, message: 'Winner ticket and reward status updated successfully.' };
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(`Failed to update winner ticket: ${error.message}`);
        }
    }

    async getWinnerTicket(rewardId: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(rewardId)) {
                throw new Error('Invalid reward ID format');
            }
            const rewardObjectId = new mongoose.Types.ObjectId(rewardId);



            const winnerTicket = await Ticket.aggregate([
                {
                    $match: {
                        reward: rewardObjectId,
                        status: TicketStatus.WIN
                    },
                },
                {
                    $lookup: {
                        from: 'rewards',
                        localField: 'reward',
                        foreignField: '_id',
                        as: 'rewardDetails',
                    },
                },
                {
                    $unwind: '$rewardDetails',
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $project: {
                        tokenNumber: 1,
                        ticketCode: 1,
                        status: 1,
                        price: '$rewardDetails.price',
                        rewardImage: '$rewardDetails.image',
                        rewardStatus: '$rewardDetails.status',
                        user: {
                            name: '$userDetails.name',
                            companyMail: '$userDetails.companyMail'
                        }
                    },
                },
            ]);

            if (!winnerTicket) {
                throw new Error('No winner ticket found for this reward');
            }

            return winnerTicket[0];
        } catch (error: any) {
            throw new Error(`Failed to fetch winner ticket: ${error.message}`);
        }
    }

    async getLastTokenNumber(rewardId: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(rewardId)) {
                throw new Error('Invalid reward ID format');
            }
            const rewardObjectId = new mongoose.Types.ObjectId(rewardId);

            const lastTicket = await Ticket.findOne({ reward: rewardObjectId })
                .sort({ tokenNumber: -1 })
                .lean();
            let lastTokenNumber = lastTicket ? lastTicket.tokenNumber : 100;
            return lastTokenNumber;
        } catch (error: any) {
            throw new Error(`Failed to fetch last Tocken number ---->: ${error.message}`);
        }
    }

    async getLastPastReward(companyId: string) {
        try {
            const lastPastReward = await Reward.findOne({ status: RewardStatus.PAST, company: companyId })
                .sort({ endTime: -1 })
                .lean();

            if (!lastPastReward) {
                throw new Error('No past reward found');
            }

            return { lastPastReward };
        } catch (error: any) {
            throw new Error(`Failed to fetch last past reward: ${error.message}`);
        }
    }
}

export default RewardService;
