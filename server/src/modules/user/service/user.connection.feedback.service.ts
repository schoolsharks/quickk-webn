import mongoose from "mongoose";
import { UserConnectionFeedback, IUserConnectionFeedback, ConnectionFeedbackStatus } from "../model/user.connection.feedback.model";
import { UserConnection } from "../model/user.connection.model";
import { ConnectionStatus } from "../types/interfaces";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";

class UserConnectionFeedbackService {

    /**
     * Create a connection feedback entry when user makes a connection
     */
    async createConnectionFeedback(userId: string, userConnectionId: string): Promise<IUserConnectionFeedback> {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userConnectionId)) {
            throw new AppError("Invalid ID format", StatusCodes.BAD_REQUEST);
        }

        // Get the user connection to extract connectionId
        const userConnection = await UserConnection.findById(userConnectionId);
        if (!userConnection) {
            throw new AppError("User connection not found", StatusCodes.NOT_FOUND);
        }

        // Check if feedback entry already exists
        const existingFeedback = await UserConnectionFeedback.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            userConnectionRef: new mongoose.Types.ObjectId(userConnectionId)
        });

        if (existingFeedback) {
            return existingFeedback;
        }

        // Create feedback entry
        // Set expiry to 30 days from now (long enough for multiple pulse cycles)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days instead of 24 hours

        // Set next pulse time to 24 hours from now (first pulse after a day)
        const nextPulseAt = new Date();
        nextPulseAt.setHours(nextPulseAt.getHours() + 24);

        const connectionFeedback = new UserConnectionFeedback({
            userId: new mongoose.Types.ObjectId(userId),
            connectionId: userConnection.connectionId,
            userConnectionRef: new mongoose.Types.ObjectId(userConnectionId),
            status: ConnectionFeedbackStatus.PENDING,
            expiresAt,
            nextPulseAt
        });

        await connectionFeedback.save();
        return connectionFeedback;
    }

    /**
     * Get pending connection feedbacks that are ready for pulse generation
     */
    async getPendingFeedbacksForPulse(userId: string): Promise<IUserConnectionFeedback[]> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid user ID format", StatusCodes.BAD_REQUEST);
        }

        const now = new Date();

        return await UserConnectionFeedback.find({
            userId: new mongoose.Types.ObjectId(userId),
            status: ConnectionFeedbackStatus.PENDING,
            // nextPulseAt: { $lte: now },
            // expiresAt: { $gt: now } // Not expired yet
        })
            .populate('connectionId', 'name businessName')
            .sort({ nextPulseAt: 1 }) // Oldest first
            .limit(1); // Only get one at a time
    }

    /**
     * Submit connection feedback response
     */
    async submitConnectionFeedbackResponse(
        userId: string,
        feedbackId: string,
        response: 'yes' | 'no'
    ): Promise<{ feedback: IUserConnectionFeedback, connectionUpdated: boolean }> {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(feedbackId)) {
            throw new AppError("Invalid ID format", StatusCodes.BAD_REQUEST);
        }

        const feedback = await UserConnectionFeedback.findOne({
            _id: new mongoose.Types.ObjectId(feedbackId),
            userId: new mongoose.Types.ObjectId(userId),
            status: ConnectionFeedbackStatus.PENDING
        });

        if (!feedback) {
            throw new AppError("Feedback not found or already responded", StatusCodes.NOT_FOUND);
        }

        // Store the response but keep status as PENDING for recurring pulses
        feedback.response = response;

        // Update UserConnection status based on response
        let connectionUpdated = false;
        if (response === 'yes') {
            await UserConnection.findByIdAndUpdate(
                feedback.userConnectionRef,
                { status: ConnectionStatus.ACCEPTED }
            );
            connectionUpdated = true;
            // Mark as responded only if connection is finalized
            feedback.status = ConnectionFeedbackStatus.RESPONDED;
        } else if (response === 'no') {
            await UserConnection.findByIdAndUpdate(
                feedback.userConnectionRef,
                { status: ConnectionStatus.REJECTED }
            );
            connectionUpdated = true;
            // Mark as responded only if connection is finalized
            feedback.status = ConnectionFeedbackStatus.RESPONDED;
        } else {
            // For any other response, set next pulse time (no need to extend expiry)
            const nextPulse = new Date();
            nextPulse.setHours(nextPulse.getHours() + 6); // Next pulse in 6 hours
            feedback.nextPulseAt = nextPulse;
        }

        await feedback.save();

        return { feedback, connectionUpdated };
    }

    /**
     * Update next pulse time for generating subsequent pulses
     */
    async updateNextPulseTime(feedbackId: string): Promise<void> {
        const nextPulseAt = new Date();
        nextPulseAt.setHours(nextPulseAt.getHours() + 6); // Next pulse in 6 hours

        await UserConnectionFeedback.findByIdAndUpdate(
            feedbackId,
            { nextPulseAt }
        );
    }

    /**
     * Get connection feedback by ID
     */
    async getConnectionFeedbackById(feedbackId: string): Promise<IUserConnectionFeedback | null> {
        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            throw new AppError("Invalid feedback ID format", StatusCodes.BAD_REQUEST);
        }

        return await UserConnectionFeedback.findById(feedbackId)
            .populate('connectionId', 'name businessName')
            .populate('userConnectionRef');
    }

    /**
     * Get all connection feedbacks for a user
     */
    async getUserConnectionFeedbacks(
        userId: string,
        status?: ConnectionFeedbackStatus,
        page: number = 1,
        limit: number = 10
    ): Promise<{ feedbacks: IUserConnectionFeedback[], totalCount: number }> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid user ID format", StatusCodes.BAD_REQUEST);
        }

        const skip = (page - 1) * limit;
        const query: any = { userId: new mongoose.Types.ObjectId(userId) };

        if (status) {
            query.status = status;
        }

        const [feedbacks, totalCount] = await Promise.all([
            UserConnectionFeedback.find(query)
                .populate('connectionId', 'name businessName')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            UserConnectionFeedback.countDocuments(query)
        ]);

        return { feedbacks, totalCount };
    }

    /**
     * Clean up expired feedbacks (this would be called by a cron job)
     */
    async cleanupExpiredFeedbacks(): Promise<number> {
        const result = await UserConnectionFeedback.deleteMany({
            status: ConnectionFeedbackStatus.PENDING,
            expiresAt: { $lt: new Date() }
        });

        return result.deletedCount || 0;
    }
}

export default UserConnectionFeedbackService;