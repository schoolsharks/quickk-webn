import Module from "../model/module.model";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import QuestionService from "../../questions/service/question.service";
import QuestionResponse from "../../questions/model/question.response";
import UserModule from "../model/user.module.model";
import UserVideo from "../model/user.video.model";
import { Types } from "mongoose";
import { IQuestion } from "../../questions/model/question.model";
import { CompletionStatus, ModuleType } from "../types/enums";

class ModuleService {
  async getModuleById(
    moduleId: mongoose.Types.ObjectId,
    questionService: QuestionService
  ) {
    try {
      const module = await Module.findById(moduleId).lean();

      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }

      let result: any = { ...module };

      if (Array.isArray(module.content)) {
        result.content = await questionService.getAllQuestions(
          module.content as mongoose.Types.ObjectId[]
        );
      }

      if (Array.isArray(module.flashcards)) {
        result.flashcards = await questionService.getAllQuestions(
          module.flashcards as mongoose.Types.ObjectId[]
        );
      }

      return result;
    } catch (error) {
      throw new AppError(
        "Error fetching module data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async calculateTotalStarsAwarded(
    moduleId: mongoose.Types.ObjectId
  ): Promise<number> {
    try {
      const module = await Module.findById(moduleId);

      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }

      if (!Array.isArray(module.assessment) || module.assessment.length === 0) {
        return 0;
      }

      const questionResponses = await QuestionResponse.find({
        question: { $in: module.assessment },
      });

      const totalStarsAwarded = questionResponses.reduce((total, response) => {
        return total + (response.starsAwarded || 0);
      }, 0);
      console.log("Total stars awarded:", totalStarsAwarded);

      return totalStarsAwarded;
    } catch (error) {
      throw new AppError(
        "Error calculating total stars awarded",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markModuleCompletedIfAssessmentAnswered(
    userId: mongoose.Types.ObjectId,
    moduleId: string
  ) {
    try {
      const module = await Module.findById(
        new mongoose.Types.ObjectId(moduleId)
      );

      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }

      if (!Array.isArray(module.assessment) || module.assessment.length === 0) {
        return;
      }

      // Check if user has answered all questions in the module's assessment
      const responses = await QuestionResponse.find({
        user: userId,
        question: { $in: module.assessment },
      });

      const existing = await UserModule.findOne({
        user: userId,
        module: moduleId,
        isCompleted: true,
      });
      if (existing) {
        return "module already marked as completed";
      }

      // Only mark as completed if user has answered all assessment questions
      if (responses.length >= module.assessment.length) {
        await UserModule.create({
          user: userId,
          module: moduleId,
          isCompleted: true,
        });
      }

      return "Module marked as completed";
    } catch (error) {
      throw new AppError(
        "Error marking module as completed",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markVideoCompleted(
    userId: Types.ObjectId,
    videoId: string
  ): Promise<{ message: string }> {
    if (!videoId) {
      throw new AppError("videoId is required", StatusCodes.BAD_REQUEST);
    }

    const existing = await UserVideo.findOne({
      user: userId,
      videoId: videoId,
      isVideoWatched: true,
    });

    if (existing) {
      return { message: "Video already marked as completed" };
    }

    await UserVideo.create({
      user: userId,
      videoId: new mongoose.Types.ObjectId(videoId),
      isVideoWatched: true,
    });

    return { message: "Video marked as completed" };
  }

  async createModulesWithTitles(titles: string[]): Promise<{ ids: string[] }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const modulesToCreate = titles.map((title) => ({
        title,
        completionStatus: "INCOMPLETE",
        type: undefined,
        duration: undefined,
        assessment: [],
        content: undefined,
      }));

      const createdModules = await Module.insertMany(modulesToCreate, {
        session,
      });

      await session.commitTransaction();
      session.endSession();

      return { ids: createdModules.map((m) => m._id.toString()) };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        "Failed to create modules",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createBlankModule(): Promise<string> {
    try {
      const moduleToCreate = {
        title: "New Module",
        completionStatus: "INCOMPLETE",
        type: undefined,
        duration: undefined,
        assessment: [],
        content: undefined,
      };

      const createdModule = await Module.create(moduleToCreate);

      return createdModule._id.toString();
    } catch (error) {
      throw new AppError(
        "Failed to create module",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createModuleWithUserData(
    type: string,
    title: string,
    duration: string
  ): Promise<string> {
    try {
      if (!type || !title || !duration) {
        throw new AppError(
          "Type, title, and duration are required",
          StatusCodes.BAD_REQUEST
        );
      }
      const content = type === ModuleType.QUESTION ? [] : "";

      const moduleToCreate = {
        title: title,
        completionStatus: CompletionStatus.INCOMPLETE,
        type: type as ModuleType,
        duration: duration,
        assessment: [],
        content: content,
      };

      const createdModule = await Module.create(moduleToCreate);

      return createdModule._id.toString();
    } catch (error) {
      throw new AppError(
        `Failed to create module : ${error}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateModule(
    moduleId: mongoose.Types.ObjectId,
    content: Partial<IQuestion>[] | string,
    title: string,
    assessment: Partial<IQuestion>[],
    flashcards: Partial<IQuestion>[], // Add this parameter
    questionService: {
      createQuestion: (data: Partial<IQuestion>) => Promise<any>;
      updateQuestion(id: string, updateData: Partial<IQuestion>): Promise<any>;
    },
    type: string,
    duration: string
  ) {
    try {
      const module = await Module.findById(moduleId);
      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }

      let contentIds: mongoose.Types.ObjectId[];
      let assessmentIds: mongoose.Types.ObjectId[];
      let flashcardIds: mongoose.Types.ObjectId[] = []; // Add this

      // Handle flashcards for both video and question types
      if (flashcards && flashcards.length > 0) {
        const createdFlashcards = await Promise.all(
          flashcards.map(async (q) => {
            if (q._id && String(q._id) !== "") {
              return await questionService.updateQuestion(q._id.toString(), q);
            } else {
              const { _id, ...questionData } = q;
              return await questionService.createQuestion(questionData);
            }
          })
        );
        flashcardIds = createdFlashcards.map((q) => q._id);
        module.flashcards = flashcardIds;
      }

      // If module is of type VIDEO, only add assessment questions
      if (module.type === ModuleType.VIDEO) {
        try {
          if (assessment && assessment.length > 0) {
            const createdAssessmentQuestions = await Promise.all(
              assessment.map(async (q) => {
                if (q._id && String(q._id) !== "") {
                  // Update existing question
                  return await questionService.updateQuestion(
                    q._id.toString(),
                    q
                  );
                } else {
                  // Create new question
                  const { _id, ...questionData } = q;
                  return await questionService.createQuestion(questionData);
                }
              })
            );
            assessmentIds = [...createdAssessmentQuestions.map((q) => q._id)];
            module.assessment = assessmentIds;
          }
          module.content = content as string;
        } catch (err) {
          console.error(
            "Error while creating/updating assessment questions for VIDEO module:",
            err
          );
          throw new AppError(
            "Error while creating/updating assessment questions for VIDEO module",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
        // content remains as string
      } else {
        // For QUESTION type, add both content and assessment questions
        try {
          if (Array.isArray(content) && content.length > 0) {
            const createdContentQuestions = await Promise.all(
              content.map(async (q) => {
                if (q._id && String(q._id) !== "") {
                  // Update existing question
                  console.log("Updated content questions");
                  return await questionService.updateQuestion(
                    q._id.toString(),
                    q
                  );
                } else {
                  // Create new question
                  console.log("created content questions");
                  const { _id, ...questionData } = q;
                  return await questionService.createQuestion(questionData);
                }
              })
            );
            contentIds = [...createdContentQuestions.map((q) => q._id)];
            module.content = contentIds;
          }
        } catch (err) {
          console.error(
            "Error while creating/updating content questions for QUESTION module:",
            err
          );
          throw new AppError(
            "Error while creating/updating content questions for QUESTION module",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
        try {
          if (assessment && assessment.length > 0) {
            const createdAssessmentQuestions = await Promise.all(
              assessment.map(async (q) => {
                if (q._id && String(q._id) !== "") {
                  // Update existing question
                  console.log("Updated assessment questions.");
                  return await questionService.updateQuestion(
                    q._id.toString(),
                    q
                  );
                } else {
                  console.log("created assessment question.");
                  // Create new question
                  const { _id, ...questionData } = q;
                  return await questionService.createQuestion(questionData);
                }
              })
            );
            assessmentIds = [...createdAssessmentQuestions.map((q) => q._id)];
            module.assessment = assessmentIds;
          }
        } catch (err) {
          console.error(
            "Error while creating/updating assessment questions for QUESTION module:",
            err
          );
          throw new AppError(
            "Error while creating/updating assessment questions for QUESTION module",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      }

      try {
        module.title = title;
        module.completionStatus = CompletionStatus.COMPLETE;
        module.type = type as ModuleType;
        module.duration = duration;
        await module.save();
        console.log(module);
        return module;
      } catch (err) {
        console.error("Error while saving module:", err);
        throw new AppError(
          "Error while saving module",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return module;
    } catch (error) {
      console.error("Error in updateModule:", error);
      throw new AppError(
        "Error updating module with questions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isModuleCompleted(moduleId: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const module = await Module.findById(moduleId).lean();
      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }
      return module.completionStatus === CompletionStatus.COMPLETE;
    } catch (error) {
      throw new AppError(
        "Error checking module completion status",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCompleteModuleById(
    moduleId: mongoose.Types.ObjectId,
    questionService: QuestionService
  ) {
    try {
      const module = await Module.findById(moduleId).lean();

      if (!module) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }

      let content: string | Types.ObjectId[] | IQuestion[] | Object = module.content;
      if (Array.isArray(module.content)) {
        content = await questionService.getAllQuestions(
          module.content as mongoose.Types.ObjectId[]
        );
      }

      let assessment: Types.ObjectId[] | IQuestion[] = module.assessment;
      if (Array.isArray(module.assessment) && module.assessment.length > 0) {
        assessment = await questionService.getAllQuestions(
          module.assessment as mongoose.Types.ObjectId[]
        );
      }

      return {
        ...module,
        content,
        assessment,
      };
    } catch (error) {
      throw new AppError(
        "Error fetching complete module data",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteModuleById(
    moduleId: mongoose.Types.ObjectId
  ): Promise<{ message: string }> {
    try {
      const deleted = await Module.findByIdAndDelete(moduleId);
      if (!deleted) {
        throw new AppError("Module not found", StatusCodes.NOT_FOUND);
      }
      return { message: "Module deleted successfully" };
    } catch (error) {
      throw new AppError(
        "Error deleting module",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default ModuleService;
