import { Request, Response, NextFunction } from "express";
import LearningService from "../services/learning.service";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { SearchHelper } from "../../../utils/search/searchHelper";
import { searchConfigs } from "../../../utils/search/searchConfigs";
import Admin from "../../admin/model/admin.model";
import learningReviewTrigger from "../../../services/emails/triggers/admin/learningReviewTrigger";

const learningService = new LearningService();

// Controller to get learning by week
export const getLearningByWeek = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    let { week } = req.body;
    const { language } = req.query;
    const companyId = req.user?.companyId;
    week = "4"; //hardcoded need to change according to the client
    if (isNaN(Number(week))) {
      return next(
        new AppError("Invalid week parameter", StatusCodes.BAD_REQUEST)
      );
    }

    const learning = await learningService.getLearningByWeek(
      Number(week),
      userId,
      companyId,
      language as string // Pass language to service
    );

    const responseData = learning.map((item) => ({
      week: item.week,
      title: item.title,
      videoUrl: item.videoUrl || "",
      items: item.items,
    }));

    res.status(StatusCodes.OK).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getLearningByWeek:", error);
    next(
      new AppError(
        "An unexpected error occurred while fetching learning data",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getTotalLearningTimeForAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const totalTime = await learningService.getTotalLearningTimeForAllUsers(
      companyId
    );
    res.status(StatusCodes.OK).json({
      status: "success",
      data: { totalTime: totalTime },
    });
  } catch (error) {
    console.error("Error in getTotalLearningTimeForAllUsers:", error);
    next(
      new AppError(
        "An unexpected error occurred while fetching total learning time",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getLearningTableData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const tableData = await learningService.getLearningTableData(companyId);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: tableData,
    });
  } catch (error) {
    console.error("Error in getLearningTableData:", error);
    next(
      new AppError(
        "An unexpected error occurred while fetching learning table data",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const updateLearningWithModules = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      learningId,
      title,
      videoUrl,
      moduleIds,
      validTill,
      publishOn,
      status,
    } = req.body;

    // Get user role for role-based status logic
    const userRole = req.user?.role;
    
    // Determine final status based on user role
    let finalStatus = status;
    if (status === "published") {
      if (userRole === "ADMIN") {
        // Admin wants to publish → send for review
        console.log("Admin attempted to publish, changing status to pending-review");
        finalStatus = "pending-review";
      } else if (userRole === "SUPER-ADMIN") {
        // Super Admin wants to publish → actually publish
        finalStatus = "published";
      }
    }

    const learning = await learningService.updateLearningWithModules({
      learningId,
      title,
      videoUrl,
      moduleIds,
      validTill,
      publishOn,
      status: finalStatus,
    });

    // Send email notification if status changed to pending-review
    if (finalStatus === "pending-review") {
      try {
        // Get all super admins from the company
        const companyId = req.user?.companyId;
        const superAdmins = await Admin.find({
          company: companyId,
          role: "super-admin",
        });

        if (superAdmins.length > 0) {
          const superAdminEmails = superAdmins.map((admin) => admin.email);
          
          // Get the admin who submitted the learning
          const submittedByAdmin = await Admin.findById(req.user?.id);
          const submittedByName = submittedByAdmin?.name || "Admin";

          // Format publish date
          const formattedDate = publishOn
            ? new Date(publishOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not Set";

          // Send email notification to all super admins
          await learningReviewTrigger({
            adminEmails: superAdminEmails,
            publishDate: formattedDate,
            moduleCount: moduleIds?.length || 0,
            learningId: learningId,
            learningTitle: title || "Untitled Learning",
            submittedBy: submittedByName,
          });

          console.log(
            `Learning review notification sent to ${superAdminEmails.length} super admin(s)`
          );
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Failed to send learning review notification emails:", emailError);
      }
    }

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: learning,
    });
  } catch (error) {
    console.error("Error in createLearningWithModules:", error);
    next(
      new AppError(
        "Failed to create learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const publishLearningIfAllModulesCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { learningId } = req.params;
    if (!learningId) {
      return next(
        new AppError("learningId is required", StatusCodes.BAD_REQUEST)
      );
    }

    // Get user role for role-based status logic
    const userRole = req.user?.role;
    
    // Determine final status based on user role
    let finalStatus = "published"; // Default intention is to publish
    if (userRole === "ADMIN") {
      // Admin wants to publish → send for review
      console.log("Admin attempted to publish learning, changing status to pending-review");
      finalStatus = "pending-review";
    } else if (userRole === "SUPER-ADMIN") {
      // Super Admin wants to publish → actually publish
      finalStatus = "published";
    }

    const updatedLearning =
      await learningService.publishLearningIfAllModulesCompleted(learningId, finalStatus);

    // Send email notification if status changed to pending-review
    if (finalStatus === "pending-review") {
      try {
        // Get all super admins from the company
        const companyId = req.user?.companyId;
        const superAdmins = await Admin.find({
          company: companyId,
          role: "super-admin",
        });

        if (superAdmins.length > 0) {
          const superAdminEmails = superAdmins.map((admin) => admin.email);
          
          // Get the admin who submitted the learning
          const submittedByAdmin = await Admin.findById(req.user?.id);
          const submittedByName = submittedByAdmin?.name || "Admin";

          // Get learning details for email
          const learning = updatedLearning as any;
          
          // Format publish date
          const formattedDate = learning.publishOn
            ? new Date(learning.publishOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Not Set";

          // Send email notification to all super admins
          await learningReviewTrigger({
            adminEmails: superAdminEmails,
            publishDate: formattedDate,
            moduleCount: learning.modules?.length || 0,
            learningId: learningId,
            learningTitle: learning.title || "Untitled Learning",
            submittedBy: submittedByName,
          });

          console.log(
            `Learning review notification sent to ${superAdminEmails.length} super admin(s)`
          );
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error("Failed to send learning review notification emails:", emailError);
      }
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      data: updatedLearning,
    });
  } catch (error) {
    console.error("Error in publishLearningIfAllModulesCompleted:", error);
    next(error);
  }
};

export const createBlankLearning = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const result = await learningService.createBlankLearning(companyId);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error in createBlankLearning:", error);
    next(
      new AppError(
        "Failed to create blank learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getLearningById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { learningId } = req.params;
    if (!learningId) {
      return next(
        new AppError("learningId is required", StatusCodes.BAD_REQUEST)
      );
    }

    const learning = await learningService.getLearningById(learningId);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: learning,
    });
  } catch (error) {
    console.error("Error in getLearningById:", error);
    next(error);
  }
};

export const deleteLearningById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { learningId } = req.body;
    if (!learningId) {
      return next(
        new AppError("learningId is required", StatusCodes.BAD_REQUEST)
      );
    }

    const result = await learningService.deleteLearningById(learningId);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error in deleteLearningById:", error);
    next(error);
  }
};

export const getLearningStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const learnings = await learningService.getAllLearnings(companyId);
    const stats = {
      total: learnings.length,
      published: 0,
      drafts: 0,
      archived: 0,
    };

    learnings.forEach((learning: any) => {
      switch (learning.status) {
        case "published":
          stats.published += 1;
          break;
        case "drafts":
          stats.drafts += 1;
          break;
        case "archived":
          stats.archived += 1;
          break;
        default:
          break;
      }
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error("Error in getLearningStats:", error);
    next(
      new AppError(
        "Failed to fetch learning stats",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getLearningTitles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.companyId;
    const allLearnings = await learningService.getAllLearnings(companyId);
    // Map to return only _id and title
    const learningTitles = allLearnings.map((learning: any) => ({
      _id: learning._id,
      title: learning.title,
    }));

    res.status(StatusCodes.OK).json({
      success: "success",
      data: learningTitles,
    });
  } catch (error) {
    console.error("Error in getLearningTitles controller:", error);
    next(
      new AppError(
        "Failed to fetch learning Titles",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const archieveLearningById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { learningId } = req.params;
    const learning = await learningService.archieveLearningById(learningId);

    res.status(StatusCodes.OK).json({
      success: "success",
      message: learning.message,
    });
  } catch (error) {
    console.error("Error in archieving learning:", error);
    next(
      new AppError(
        "Failed to archieve learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const searchLearning = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await SearchHelper.search(
      searchConfigs.learning,
      req.query,
      req?.user.companyId
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};
