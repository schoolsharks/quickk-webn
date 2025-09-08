import { NextFunction, Request, Response } from 'express';
import UserService from '../service/user.service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import mongoose from 'mongoose';
import { SearchHelper } from '../../../utils/search/searchHelper';
import { searchConfigs } from '../../../utils/search/searchConfigs';

const userService = new UserService();

export const getAllUsersWithDetails = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const users = await userService.getAllUsersWithDetails(companyId);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users with details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getAllAvatars = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const avatars = await userService.getAllAvatars();
        res.status(200).json(avatars);
    } catch (error) {
        console.error('Error fetching avatars:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const selectAvatar = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user.id;
        const { avatarId } = req.body;

        const user = await userService.selectAvatar(
            userId,
            avatarId
        );

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error selecting avatar:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};


export const getAllUsersTableData = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const users = await userService.getAllUsers(companyId);

        const filteredUsers = users.map((user: any) => ({
            _id: user._id,
            name: user.name,
            companyMail: user.companyMail,
            contact: user.contact,
            learningStreak: user.learningStreak,
            chapter: user.chapter,
            businessName: user.businessName,
            instagram: user.instagram,
            facebook: user.facebook,
            businessCategory: user.businessCategory,
            specialisation: user.specialisation,
            updatedAt: user.updatedAt || "",
        }));

        res.status(StatusCodes.OK).json(filteredUsers);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error fetching users:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};


export const addEditUser = async (req: Request, res: Response) => {
    try {
        const { userDetails } = req.body;

        if (!userDetails) {
            res.status(400).json({
                success: false,
                message: "User details are required in request body",
            });
        }

        const userData = {
            userId: userDetails.userId,
            companyMail: userDetails.companyMail,
            name: userDetails.name,
            contact: userDetails.contact,
            address: userDetails.address,
            chapter: userDetails.chapter,
            businessName: userDetails.businessName,
            instagram: userDetails.instagram,
            facebook: userDetails.facebook,
            businessCategory: userDetails.businessCategory,
            specialisation: userDetails.specialisation,
            designation: userDetails.designation || "",
            currentStage: userDetails.currentStage || "",
            communityGoal: userDetails.communityGoal || "",
            interestedEvents: userDetails.interestedEvents || "",
        };

        const result = await userService.AddEditUser(userData);

        if (result.success) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.data,
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message,
                error: result.error || undefined,
            });
        }
    } catch (error) {
        console.error("createUser controller error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getUserById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId } = req.params;

        const id = new mongoose.Types.ObjectId(userId);
        const user = await userService.getUserById(id);

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error fetching users:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};


export const createBlankUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const id = await userService.createBlankUser(companyId);
        res.status(StatusCodes.OK).json(id);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error creating Blank users:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};

export const deleteUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new AppError('userId is required', StatusCodes.BAD_REQUEST));
        }

        await userService.deleteUserById(userId);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Error deleting user:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await SearchHelper.search(searchConfigs.user, req.query, req?.user.companyId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};

export const getActiveUsersStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        if (!companyId) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Company ID is required" });
            return;
        }

        const users = await userService.getAllUsers(companyId);

        const now = new Date();
        const getCount = (days: number) => {
            const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            return users.filter(
                (user: any) =>
                    user.lastLearningActivity &&
                    new Date(user.lastLearningActivity) >= since
            ).length;
        };

        res.status(StatusCodes.OK).json({
            today: getCount(1),
            last15Days: getCount(15),
            last30Days: getCount(30),
            last90Days: getCount(90),
        });
    } catch (error) {
        console.error("Error fetching active users stats:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};

export const bulkUploadUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { users } = req.body;
        const companyId = req.user?.companyId;

        if (!users || !Array.isArray(users)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Users array is required",
            });
            return;
        }

        if (!companyId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Company ID is required",
            });
            return;
        }

        const result = await userService.bulkCreateUsers(users, companyId);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error in bulk upload:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};