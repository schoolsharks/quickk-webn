import { Request, Response, NextFunction } from "express";
import UserConnectionFeedbackService from "../service/user.connection.feedback.service";
import UserService from "../service/user.service";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";

const userConnectionFeedbackService = new UserConnectionFeedbackService();
const userService = new UserService();

/**
 * Get pending connection feedback for daily pulse
 */
export const getConnectionFeedbackForPulse = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const pendingFeedbacks = await userConnectionFeedbackService.getPendingFeedbacksForPulse(userId.toString());

        if (pendingFeedbacks.length === 0) {
            res.status(StatusCodes.OK).json({
                success: true,
                message: "No pending connection feedback available",
                data: null
            });
            return;
        }

        // Get the first pending feedback
        const feedback = pendingFeedbacks[0];
        const connectionUser = feedback.connectionId as any;

        // Format response for daily pulse
        const pulseData = {
            id: (feedback._id as any).toString(),
            type: "connectionFeedback",
            connectionUserId: connectionUser._id,
            connectionUserName: connectionUser.name || connectionUser.businessName || "Unknown User",
            questionText: `Did you get a chance to talk to ${connectionUser.name || connectionUser.businessName}?`,
            options: ["Yes", "No"],
            score: 5, // Award 5 stars for responding
            createdAt: feedback.createdAt,
            expiresAt: feedback.expiresAt
        };

        res.status(StatusCodes.OK).json({
            success: true,
            data: pulseData
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit connection feedback response
 */
export const submitConnectionFeedbackResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const { feedbackId, response } = req.body;

        if (!feedbackId || !response) {
            throw new AppError("Feedback ID and response are required", StatusCodes.BAD_REQUEST);
        }

        if (!['yes', 'no'].includes(response.toLowerCase())) {
            throw new AppError("Response must be 'yes' or 'no'", StatusCodes.BAD_REQUEST);
        }

        const result = await userConnectionFeedbackService.submitConnectionFeedbackResponse(
            userId.toString(),
            feedbackId,
            response.toLowerCase()
        );

        // Award stars to user for responding
        await userService.awardStars(userId, 5);

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Connection feedback submitted successfully. Connection status ${result.connectionUpdated ? 'updated' : 'unchanged'}.`,
            data: {
                feedback: result.feedback,
                connectionUpdated: result.connectionUpdated,
                starsAwarded: 5
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's connection feedback history
 */
export const getUserConnectionFeedbacks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as any;

        const result = await userConnectionFeedbackService.getUserConnectionFeedbacks(
            userId.toString(),
            status,
            page,
            limit
        );

        res.status(StatusCodes.OK).json({
            success: true,
            data: result.feedbacks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(result.totalCount / limit),
                totalCount: result.totalCount,
                hasNextPage: page < Math.ceil(result.totalCount / limit),
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get connection feedback by ID
 */
export const getConnectionFeedbackById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { feedbackId } = req.params;
        const userId = req.user.id;

        if (!feedbackId) {
            throw new AppError("Feedback ID is required", StatusCodes.BAD_REQUEST);
        }

        const feedback = await userConnectionFeedbackService.getConnectionFeedbackById(feedbackId);

        if (!feedback) {
            throw new AppError("Connection feedback not found", StatusCodes.NOT_FOUND);
        }

        // Ensure the feedback belongs to the requesting user
        if (feedback.userId.toString() !== userId.toString()) {
            throw new AppError("Unauthorized access to feedback", StatusCodes.FORBIDDEN);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};