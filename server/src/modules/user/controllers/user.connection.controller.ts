import { NextFunction, Request, Response } from "express";
import UserConnectionService from "../service/user.connection.service";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";

const userConnectionService = new UserConnectionService();

export const addConnection = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        if (!userId) {
            throw new AppError("User ID not found in request", StatusCodes.UNAUTHORIZED);
        }

        const { connectionId, platform } = req.body;

        if (!connectionId || !platform) {
            throw new AppError("Connection ID and platform are required", StatusCodes.BAD_REQUEST);
        }

        const connection = await userConnectionService.addConnection(
            userId.toString(),
            connectionId,
            platform
        );

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Connection added successfully",
            data: connection
        });
    } catch (error) {
        next(error);
    }
};

export const getUserConnections = async (
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

        const result = await userConnectionService.getUserConnections(userId.toString(), page, limit);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Connections retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};