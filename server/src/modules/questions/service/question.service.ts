import QuestionModel, { IQuestion } from "../model/question.model";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import QuestionResponse, {
  IQuestionResponse,
} from "../model/question.response";
import mongoose from "mongoose";

class QuestionService {
  async getAllQuestions(
    questionIds: mongoose.Types.ObjectId[],
  ): Promise<IQuestion[]> {
    try {
      const questions = await QuestionModel.find(
        { _id: { $in: questionIds } },
      );
      return questions;
    } catch (error) {
      throw new AppError(
        "Error fetching questions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getQuestionById(id: string): Promise<IQuestion> {
    try {
      const question = await QuestionModel.findById(id);
      if (!question) {
        throw new AppError("Question not found", StatusCodes.NOT_FOUND);
      }
      return question;
    } catch (error) {
      throw new AppError(
        "Error fetching question",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async collectResponse(responseData: {
    user: mongoose.Types.ObjectId;
    question: string;
    response: string;
    starsAwarded?: number;
  }): Promise<IQuestionResponse> {
    try {
      const { user, question, response, starsAwarded } = responseData;
      const questionResponse = await QuestionResponse.create({
        user,
        question,
        response,
        starsAwarded,
      });
      return questionResponse;
    } catch (error) {
      throw new AppError(
        "Error collecting question response",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserResponsesForQuestions(
    userId: mongoose.Types.ObjectId,
    questionIds: mongoose.Types.ObjectId[]
  ): Promise<IQuestionResponse[]> {
    try {
      const responses = await QuestionResponse.find({
        user: userId,
        question: { $in: questionIds },
      });
      return responses;
    } catch (error) {
      throw new AppError(
        "Error fetching user responses for questions",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getResponseCountByQuestionId(
    questionId: mongoose.Types.ObjectId
  ): Promise<number> {
    try {
      const count = await QuestionResponse.countDocuments({
        question: questionId,
      });
      return count;
    } catch (error) {
      throw new AppError(
        "Error fetching response count",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createQuestion(questionData: Partial<IQuestion>) {
    try {
      const question = await QuestionModel.create(questionData);
      return question;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Error creating question : ",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateQuestion(id: string, updateData: Partial<IQuestion>) {
    try {
      const updatedQuestion = await QuestionModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedQuestion) {
        throw new AppError("Question not found", StatusCodes.NOT_FOUND);
      }
      return updatedQuestion;
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Error updating question",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //     async deleteQuestion(id: string) {
  //         try {
  //             const deletedQuestion = await QuestionModel.findByIdAndDelete(id);
  //             if (!deletedQuestion) {
  //                 throw new AppError('Question not found', StatusCodes.NOT_FOUND);
  //             }
  //         } catch (error) {
  //             throw new AppError('Error deleting question', StatusCodes.INTERNAL_SERVER_ERROR);
  //         }
  //     }

  async cloneQuestion(questionId: mongoose.Types.ObjectId): Promise<IQuestion> {
    try {
      const originalQuestion = await QuestionModel.findById(questionId);
      if (!originalQuestion) {
        throw new AppError("Question not found", StatusCodes.NOT_FOUND);
      }

      // Create a copy of the question without the _id and __v
      const questionData = originalQuestion.toObject();
      const { _id, __v, ...cloneData } = questionData;

      const clonedQuestion = await QuestionModel.create(cloneData);
      return clonedQuestion;
    } catch (error) {
      throw new AppError(
        "Error cloning question",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default QuestionService;
