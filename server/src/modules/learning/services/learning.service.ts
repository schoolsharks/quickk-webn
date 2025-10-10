import LearningModel from "../model/learning.model";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import User from "../../user/model/user.model";
import UserModule from "../model/user.module.model";
import ModuleService from "./module.service";
import { Status } from "../types/enums";
import { Types } from "mongoose";

const moduleService = new ModuleService();

class LearningService {
  async getLearningByWeek(
    week: number,
    userId: mongoose.Types.ObjectId,
    companyId: string,
    language?: string
  ) {
    try {

      const matchFilter: any = {
        week: { $lte: 22 },
        company: new Types.ObjectId(companyId),
      };
      
      // Add language filter if provided
      if (language) {
        matchFilter.language = language;
      }

      const result = await LearningModel.aggregate([
        {
          $match: matchFilter,
        },
        {
          $lookup: {
            from: "modules",
            localField: "modules",
            foreignField: "_id",
            as: "moduleData",
          },
        },
        {
          $unwind: {
            path: "$moduleData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "usermodules",
            let: { moduleId: "$moduleData._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$module", "$$moduleId"] },
                      { $eq: ["$user", { $toObjectId: userId }] },
                    ],
                  },
                },
              },
              { $project: { isCompleted: 1, _id: 0 } },
            ],
            as: "userModuleData",
          },
        },
        {
          $addFields: {
            "moduleData.isCompleted": {
              $cond: [
                { $gt: [{ $size: "$userModuleData" }, 0] },
                { $arrayElemAt: ["$userModuleData.isCompleted", 0] },
                false,
              ],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            week: { $first: "$week" },
            title: { $first: "$title" },
            videoUrl: { $first: "$videoUrl" }, // Include videoUrl
            items: { $push: "$moduleData" },
          },
        },
        {
          $project: {
            _id: 0,
            week: 1,
            title: 1,
            videoUrl: 1, // Include in final projection
            items: {
              $map: {
                input: "$items",
                as: "mod",
                in: {
                  moduleId: "$$mod._id",
                  title: "$$mod.title",
                  duration: "$$mod.duration",
                  isCompleted: "$$mod.isCompleted",
                },
              },
            },
          },
        },
      ]);

      if (!result || result.length === 0) {
        throw new AppError(
          "Learning for the specified week not found",
          StatusCodes.NOT_FOUND
        );
      }

      return result;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching learning data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLearningByModuleId(moduleId: string) {
    try {
      const result = await LearningModel.findOne({
        modules: { $in: [moduleId] },
      }).lean();

      if (!result) {
        throw new AppError(
          "Learning for the specified module ID not found",
          StatusCodes.NOT_FOUND
        );
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching learning data by module ID",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNextLearning(week: number) {
    try {
      const result = await LearningModel.findOne({ week: { $gt: week } })
        .sort({ week: 1 })
        .lean();

      return result;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching next learning data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTotalLearningTimeForAllUsers(companyId: string) {
    try {
      const users = await User.find({ company: companyId }, { time: 1 }).lean();
      const totalTime = users.reduce((sum, user) => {
        return sum + (user.time ?? 0);
      }, 0);

      return totalTime;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching total learning time for users",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLearningProgress(userId: mongoose.Types.ObjectId) {
    try {
      // Fetch all learning documents with week <= 22
      const learnings = await LearningModel.find({
        week: { $lte: 22 },
      }).lean();

      // Collect all module IDs from all learnings
      const moduleIds = learnings.flatMap(learning => learning.modules || []);

      if (moduleIds.length === 0) {
        return { progress: 0 };
      }

      const completedCount = await UserModule.countDocuments({
        user: userId,
        module: { $in: moduleIds },
        isCompleted: true,
      });

      const progress = Math.floor((completedCount / moduleIds.length) * 100);

      return { progress };
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching learning progress",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLearningTableData(companyId: string) {
    try {
      const learnings = await LearningModel.aggregate([
        { $match: { company: new Types.ObjectId(companyId) } },
        {
          $project: {
            _id: 1,
            name: "$title",
            modules: { $size: "$modules" },
            status: 1,
            moduleIds: "$modules",
          },
        },
        {
          $lookup: {
            from: "usermodules",
            let: { moduleIds: "$moduleIds" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$module", "$$moduleIds"] },
                      { $eq: ["$isCompleted", true] },
                    ],
                  },
                },
              },
              { $group: { _id: "$user" } },
            ],
            as: "solvedUsers",
          },
        },
        {
          $addFields: {
            users: { $size: "$solvedUsers" },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            modules: 1,
            status: 1,
            users: 1,
          },
        },
      ]);
      return learnings;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching learning table data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateLearningWithModules(details: {
    learningId: string;
    title: string;
    videoUrl?: string; // Add this
    moduleIds: string[];
    validTill?: Date;
    publishOn?: Date;
    status?: string;
  }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const learning = await LearningModel.findByIdAndUpdate(
        details.learningId,
        {
          title: details.title,
          videoUrl: details.videoUrl,
          modules: details.moduleIds,
          status: details.status ? details.status : Status.Drafts,
          validTill: details.validTill,
          publishOn: details.publishOn,
        },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return learning;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        "Failed to create learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async publishLearningIfAllModulesCompleted(learningId: string, status: string = "published") {
    try {
      const learning = await LearningModel.findById(learningId).lean();
      if (!learning) {
        throw new AppError("Learning not found", StatusCodes.NOT_FOUND);
      }
      if (!Array.isArray(learning.modules) || learning.modules.length === 0) {
        throw new AppError(
          "Create at least one module",
          StatusCodes.NO_CONTENT
        );
      }

      for (const moduleId of learning.modules) {
        const isCompleted = await moduleService.isModuleCompleted(
          new mongoose.Types.ObjectId(moduleId)
        );
        if (!isCompleted) {
          throw new AppError(
            "All modules must be completed before publishing the learning",
            StatusCodes.BAD_REQUEST
          );
        }
      }
      
      // Use the provided status (either "published" or "pending-review")
      const updatedLearning = await LearningModel.findByIdAndUpdate(
        learningId,
        { status: status },
        { new: true }
      );
      return updatedLearning;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Failed to publish learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createBlankLearning(companyId: string) {
    try {
      const learning = await LearningModel.create({
        title: "Untitled",
        videoUrl: "", // Add empty string as default
        modules: [],
        status: Status.Drafts,
        company: new Types.ObjectId(companyId),
      });
      return { id: learning._id };
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Failed to create blank learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLearningById(learningId: string) {
    try {
      const learning = await LearningModel.findById(learningId).lean();
      if (!learning) {
        throw new AppError("Learning not found", StatusCodes.NOT_FOUND);
      }

      if (learning.modules && learning.modules.length > 0) {
        const modules = await LearningModel.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(learningId) } },
          {
            $lookup: {
              from: "modules",
              localField: "modules",
              foreignField: "_id",
              as: "modules",
            },
          },
          { $project: { modules: 1, _id: 0, videoUrl: 1 } }, // Include videoUrl
        ]);
        learning.modules = modules[0]?.modules || [];
      }
      return learning;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching learning by ID",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteLearningById(learningId: string) {
    try {
      const deleted = await LearningModel.findByIdAndDelete(learningId);
      if (!deleted) {
        throw new AppError("Learning not found", StatusCodes.NOT_FOUND);
      }
      return { message: "Learning deleted successfully" };
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Failed to delete learning",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllLearnings(companyId: string) {
    try {
      const learnings = await LearningModel.find({ company: companyId }).lean();
      return learnings;
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Error fetching all learnings",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async archieveLearningById(learningId: string) {
    try {
      const learning = await LearningModel.findByIdAndUpdate(learningId, {
        status: Status.Archived,
      });
      if (!learning) {
        throw new AppError("Learning not found", StatusCodes.NOT_FOUND);
      }
      return { message: "Learning Archieved successfully" };
    } catch (error) {
      console.error(error);
      throw new AppError(
        "Failed to archieve learning.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default LearningService;
