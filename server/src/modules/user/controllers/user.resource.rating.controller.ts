import { NextFunction, Request, Response } from "express";
import UserResourceRatingService from "../service/user.resource.rating.service";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";
import mongoose from "mongoose";

const userResourceRatingService = new UserResourceRatingService();

export const submitResourceRating = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const { ratingId, rating } = req.body;

        if (!ratingId || rating === undefined) {
            throw new AppError("Rating ID and rating are required", StatusCodes.BAD_REQUEST);
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            throw new AppError("Rating must be a number between 1 and 5", StatusCodes.BAD_REQUEST);
        }

        const resourceRating = await userResourceRatingService.submitResourceRatingResponse(
            ratingId,
            new mongoose.Types.ObjectId(userId),
            rating
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Resource rating submitted successfully",
            data: resourceRating,
        });
    } catch (error) {
        next(error);
    }
};

export const rescheduleResourceRating = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const { ratingId } = req.body;

        if (!ratingId) {
            throw new AppError("Rating ID is required", StatusCodes.BAD_REQUEST);
        }

        const resourceRating = await userResourceRatingService.rescheduleResourceRating(
            ratingId,
            new mongoose.Types.ObjectId(userId)
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Resource rating rescheduled successfully",
            data: resourceRating,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserResourceRatings = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const { status } = req.query;

        const ratings = await userResourceRatingService.getUserResourceRatings(
            new mongoose.Types.ObjectId(userId),
            status as any
        );

        res.status(StatusCodes.OK).json({
            success: true,
            data: ratings,
        });
    } catch (error) {
        next(error);
    }
};

export const getResourceRatingStats = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { resourceId } = req.params;

        if (!resourceId) {
            throw new AppError("Resource ID is required", StatusCodes.BAD_REQUEST);
        }

        const stats = await userResourceRatingService.getResourceRatingStats(new mongoose.Types.ObjectId(resourceId));

        res.status(StatusCodes.OK).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};