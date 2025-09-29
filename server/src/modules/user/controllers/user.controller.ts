import { NextFunction, Request, Response } from "express";
import UserService from "../service/user.service";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";
import mongoose from "mongoose";
import { SearchHelper } from "../../../utils/search/searchHelper";
import { searchConfigs } from "../../../utils/search/searchConfigs";
import AdminService from "../../admin/service/admin.service";

const userService = new UserService();
const adminService = new AdminService();

export const getAllUsersWithDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const usersData = await userService.getAllUsersWithDetails(companyId);

    // Sort users by totalStars in descending order and limit to top 10
    const sortedUsers = [...usersData.users]
      .sort((a, b) => b.totalStars - a.totalStars)
      .slice(0, 10);

    const responseData = {
      ...usersData,
      users: sortedUsers
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching users with details:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
    console.error("Error fetching avatars:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const selectAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { avatarId } = req.body;

    const user = await userService.selectAvatar(userId, avatarId);

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
    const { webnClubMember } = req.query; // Get filter from query params

    let users = await userService.getAllUsers(companyId);

    // Filter users by webnClubMember if provided
    if (typeof webnClubMember !== "undefined") {
      const isMember = webnClubMember === "true";
      users = users.filter((user: any) => !!user.webnClubMember === isMember);
    }

    const filteredUsers = users.map((user: any) => ({
      _id: user._id,
      name: user.name,
      companyMail: user.companyMail,
      contact: user.contact,
      learningStreak: user.learningStreak,
      chapter: user.chapter,
      businessName: user.businessName,
      businessLogo: user.businessLogo,
      instagram: user.instagram,
      facebook: user.facebook,
      businessCategory: user.businessCategory,
      specialisation: user.specialisation,
      updatedAt: user.updatedAt || "",
      webnClubMember: user.webnClubMember || false,
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
    let userDetails: any;
    let businessLogoUrl: string | undefined;

    // Check if request contains files (FormData) or is JSON
    const hasFiles =
      req.files && Array.isArray(req.files) && req.files.length > 0;

    if (hasFiles) {
      // Handle FormData request with file uploads
      userDetails = JSON.parse(req.body.userDetails || "{}");

      // Find business logo file if uploaded
      const logoFile = (req.files as Express.MulterS3.File[]).find(
        (file: Express.MulterS3.File) => file.fieldname === "businessLogo"
      );

      if (logoFile) {
        businessLogoUrl = logoFile.location; // S3 URL from multer-s3
      }

      // If updating user and has new logo, delete old logo
      if (userDetails.userId && userDetails.currentBusinessLogo && logoFile) {
        try {
          await adminService.deleteImageFromS3(userDetails.currentBusinessLogo);
        } catch (error) {
          console.warn("Failed to delete old business logo:", error);
        }
      }
    } else {
      // Handle regular JSON request
      userDetails = req.body.userDetails;
    }

    if (!userDetails) {
      res.status(400).json({
        success: false,
        message: "User details are required in request body",
      });
      return;
    }

    const user = await userService.getUserById(userDetails.userId);

    const userData = {
      userId: userDetails.userId,
      companyMail: userDetails.companyMail,
      name: userDetails.name,
      contact: userDetails.contact,
      address: userDetails.address,
      chapter: userDetails.chapter,
      businessName: userDetails.businessName,
      businessLogo: businessLogoUrl || userDetails.businessLogo || "",
      instagram: userDetails.instagram,
      facebook: userDetails.facebook,
      businessCategory: userDetails.businessCategory,
      specialisation: userDetails.specialisation,
      designation: userDetails.designation || user?.designation || "",
      currentStage: userDetails.currentStage || user?.currentStage || "",
      communityGoal: userDetails.communityGoal || user?.communityGoal || "",
      interestedEvents: userDetails.interestedEvents || user?.interestedEvents || "",
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
      return next(new AppError("userId is required", StatusCodes.BAD_REQUEST));
    }

    await userService.deleteUserById(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User deleted successfully",
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

export const moveUserToWebn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(new AppError("userId is required", StatusCodes.BAD_REQUEST));
    }
    const updatedUser = await userService.moveUserToWebn(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User moved to Webn successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error moving user to Webn:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
      });
    }
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req?.user.id;
  try {
    const result = await SearchHelper.search(
      searchConfigs.user,
      req.query,
      req?.user.companyId
    );

    // Filter out users where webnClubMember === false and the requesting user
    if (result && Array.isArray(result.data)) {
      result.data = result.data.filter(
        (user: any) => user.webnClubMember !== false && user._id.toString() !== userId.toString()
      );
    }
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

export const getActiveUsersStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Company ID is required" });
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

export const getUserRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const companyId = req.user?.companyId;
    const { page = 1, limit = 10, refreshToken } = req.query;

    if (!companyId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Company ID is required",
      });
      return;
    }

    console.log(`Getting recommendations for user: ${userId}, excluding from results`);

    const result = await userService.getUserRecommendations(
      userId,
      companyId,
      {
        page: Number(page),
        limit: Number(limit),
        refreshToken: refreshToken as string,
      }
    );

    // Additional safety check - filter out current user if somehow included
    if (result.recommendations) {
      result.recommendations = result.recommendations.filter(
        (user: any) => user._id.toString() !== userId.toString()
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      console.error("Error fetching user recommendations:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};
