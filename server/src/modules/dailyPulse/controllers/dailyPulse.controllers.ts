import { Request, Response, NextFunction } from 'express';
import { generateTodayDate } from '../../../utils/generateTodayDate';
import QuestionService from '../../questions/service/question.service';
import InfoCardService from '../../questions/service/question.infoCard.service';
import DailyPulse from '../model/dailyPulse.model';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import UserService from '../../user/service/user.service';
import { PulseType, Status } from '../types/enum';
import DailyPulseService from '../services/dailyPulse.Service';
import { SearchHelper } from '../../../utils/search/searchHelper';
import { searchConfigs } from '../../../utils/search/searchConfigs';
import mongoose from 'mongoose';
// import AdminService from '../../admin/service/admin.service';


// const imageUploadService = new AdminService();
const questionService = new QuestionService();
const infoCardService = new InfoCardService();
const userService = new UserService();
const dailyPulseService = new DailyPulseService();

export const getDailyPulses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : generateTodayDate();
    const user = req.user?.id;
    const companyId = req.user?.companyId;

    if (!user) {
      return next(new AppError('User is required', StatusCodes.BAD_REQUEST));
    }

    const dailyPulse = await DailyPulse.findOne({ publishOn: date, status: Status.Published, company: companyId });
    if (!dailyPulse) {
      res.status(404).json({ message: 'No daily pulses found for the given date.' });
      return;
    }

    const pulseIds = dailyPulse.pulses.map(pulse => pulse.refId);

    // Fetch questions, info cards, and user responses/feedback
    const [infoCards, questions, questionResponses, infoCardFeedback] = await Promise.all([
      infoCardService.getAllInfoCards(pulseIds),
      questionService.getAllQuestions(pulseIds),
      questionService.getUserResponsesForQuestions(user, pulseIds),
      infoCardService.getUserFeedbackForInfoCards(user, pulseIds),
    ]);

    // Create a map for quick lookup by ID
    const infoCardMap = new Map(infoCards.map(i => [i._id.toString(), i]));
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
    const questionResponseMap = new Map(questionResponses.map(r => [r.question.toString(), r.response]));
    const infoCardFeedbackMap = new Map(infoCardFeedback.map(f => [f.infoCard.toString(), f.feedback]));

    // Merge & transform into a unified array
    const pulseItems = dailyPulse.pulses.map(pulse => {
      const id = pulse.refId.toString();

      if (infoCardMap.has(id)) {
        const i = infoCardMap.get(id);
        if (!i) return null;
        return {
          id,
          type: 'infoCard',
          title: i.title,
          content: i.content,
          wantFeedback: i.wantFeedback,
          feedback: infoCardFeedbackMap.get(id) || null,
          score: i.score,
        };
      } else if (questionMap.has(id)) {
        const q = questionMap.get(id);
        if (!q) return null;
        return {
          id,
          type: 'QuestionTwoOption',
          questionText: q.questionText,
          image: q.image || null,
          optionType: q.optionType,
          options: q.options,
          questionOptions: q.questionOptions || [],
          response: questionResponseMap.get(id) || null,
          score: q.score,
        };
      } else {
        return null;
      }
    }).filter(item => item !== null);

    res.status(200).json({
      date,
      pulseItems,
    });
  } catch (error) {
    next(error);
  }
};


export const submitPulseResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refId, type, feedback, questionResponse } = req.body;
    const user = req.user?.id;

    if (!user || !refId || !type) {
      return next(new AppError('user, refId, and type are required', StatusCodes.BAD_REQUEST));
    }

    let starsToAward = 0;

    if (type === 'QuestionTwoOption') {
      const question = await questionService.getQuestionById(refId);
      if (!question) {
        return next(new AppError('Question not found', StatusCodes.NOT_FOUND));
      }
      starsToAward = question.score || 0;
    } else if (type === 'infoCard') {
      const infoCard = await infoCardService.getInfoCardById(refId);
      if (!infoCard) {
        return next(new AppError('InfoCard not found', StatusCodes.NOT_FOUND));
      }
      starsToAward = infoCard.score || 0;
    }

    let result;

    if (type === 'QuestionTwoOption') {
      if (!questionResponse) {
        return next(new AppError('Question response is required for QuestionTwoOption type', StatusCodes.BAD_REQUEST));
      }
      result = await questionService.collectResponse({ user, question: refId, response: questionResponse });
    } else if (type === 'infoCard') {
      if (!feedback) {
        return next(new AppError('Feedback is required for infoCard type', StatusCodes.BAD_REQUEST));
      }
      result = await infoCardService.collectFeedback({ user, feedback, infoCard: refId });
    } else {
      return next(new AppError('Invalid response type', StatusCodes.BAD_REQUEST));
    }

    await userService.awardStars(user, starsToAward);
    await userService.updateLearningStreak(user);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



export const getAllDailyPulsesWithStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch all daily pulses sorted by publishOn descending
    const companyId = req.user?.companyId
    const dailyPulses = await DailyPulse.find({ company: companyId }).sort({ publishOn: -1 });
    // For each daily pulse, build the response array
    const result = await Promise.all(
      dailyPulses.map(async (pulseDoc: any) => {
        const { publishOn, pulses, status, _id } = pulseDoc;

        // For each pulse, get response/feedback count based on type
        const pulseDetails = await Promise.all(
          pulses.map(async (pulse: any) => {
            if (pulse.type === 'question') {
              const responseCount = await questionService.getResponseCountByQuestionId(pulse.refId);
              return {
                refId: pulse.refId,
                type: pulse.type,
                responseCount,
              };
            } else if (pulse.type === 'infoCard') {
              const feedbackCount = await infoCardService.getFeedbackCountByInfocardId(pulse.refId);
              return {
                refId: pulse.refId,
                type: pulse.type,
                feedbackCount,
              };
            } else {
              return {
                refId: pulse.refId,
                type: pulse.type,
              };
            }
          })
        );

        return {
          publishOn,
          status,
          pulses: pulseDetails,
          _id: _id,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};



export const updateDailyPulse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pulses, stars = 0, status = 'drafts', publishOn, dailyPulseId } = req.body;
    const uploadedFiles: Express.Multer.File[] = req.files as Express.Multer.File[] || [];

    // Parse pulses
    let parsedPulses;
    try {
      parsedPulses = Array.isArray(pulses) ? pulses : JSON.parse(pulses as string);
    } catch (error) {
      return next(new AppError('Invalid pulses format', StatusCodes.BAD_REQUEST));
    }

    if (!Array.isArray(parsedPulses) || parsedPulses.length === 0) {
      return next(new AppError('At least one pulse is required', StatusCodes.BAD_REQUEST));
    }

    // Map uploaded files to pulses
    const fileMapping = mapFilesToPulses(uploadedFiles);

    // Create questions/infoCards with proper image handling
    const createdPulses = await Promise.all(
      parsedPulses.map(async (pulse: any, index: number) => {
        if (!pulse.type) {
          throw new AppError('Pulse type is required', StatusCodes.BAD_REQUEST);
        }

        // Attach uploaded images to pulse data
        const pulseData = await attachImagesToPulse(pulse.data, index, fileMapping);



        if (pulse.type === 'infoCard') {
          if (pulseData._id && pulseData._id !== '') {
            // Update existing infoCard
            const updatedInfoCard = await infoCardService.updateInfoCard(pulseData._id, pulseData);
            return {
              refId: updatedInfoCard._id,
              type: PulseType.InfoCard,
            };
          } else {
            // Create new infoCard
            const infoCard = await infoCardService.createInfoCard(pulseData);
            return {
              refId: infoCard._id,
              type: PulseType.InfoCard,
            };
          }
        } else if (pulse.type === 'question') {
          if (pulseData._id && pulseData._id !== '') {
            // Update existing question
            const updatedQuestion = await questionService.updateQuestion(pulseData._id, pulseData);
            return {
              refId: updatedQuestion._id,
              type: PulseType.Question,
            };
          } else {
            // Create new question
            const question = await questionService.createQuestion(pulseData);
            return {
              refId: question._id,
              type: PulseType.Question,
            };
          }
        } else {
          throw new AppError('Invalid pulse type', StatusCodes.BAD_REQUEST);
        }
      })
    );

    const dailyPulse = await dailyPulseService.updateDailyPulse(dailyPulseId, {
      publishOn,
      pulses: createdPulses,
      stars,
      status,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: dailyPulse,
      uploadedImages: uploadedFiles.map(img => ({
        originalName: img.originalname,
        url: (img as any).location,
        size: img.size,
        fieldname: img.fieldname
      }))
    });
  } catch (error) {
    // Clean up uploaded images on error (existing cleanup logic)
    next(error);
  }
};

// Helper function to map files to pulses
function mapFilesToPulses(files: Express.Multer.File[]) {
  const mapping: {
    [pulseIndex: number]: {
      image?: string;
      options?: string[];
    }
  } = {};

  files.forEach(file => {
    try {
      const fieldname = file.fieldname;
      const imageUrl = (file as any).location;

      if (fieldname.startsWith('pulse_') && fieldname.includes('_image')) {
        // Extract pulse index from fieldname like "pulse_0_image"
        const pulseIndex = parseInt(fieldname.split('_')[1]);
        if (!mapping[pulseIndex]) mapping[pulseIndex] = {};
        mapping[pulseIndex].image = imageUrl;
      } else if (fieldname.startsWith('pulse_') && fieldname.includes('_option_')) {
        // Extract pulse index and option index from fieldname like "pulse_0_option_1"
        const parts = fieldname.split('_');
        const pulseIndex = parseInt(parts[1]);
        const optionIndex = parseInt(parts[3]);

        if (!mapping[pulseIndex]) mapping[pulseIndex] = {};
        if (!mapping[pulseIndex].options) mapping[pulseIndex].options = [];
        mapping[pulseIndex].options![optionIndex] = imageUrl;
      }
    } catch (error) {
      console.error('Error parsing fieldname:', file.fieldname, error);
      // Continue processing other files if one fails
    }
  });

  return mapping;
}

// Helper function to attach images to pulse data
async function attachImagesToPulse(
  pulseData: any,
  pulseIndex: number,
  fileMapping: any
) {
  const updatedData = { ...pulseData };
  const pulseFiles = fileMapping[pulseIndex];

  if (pulseFiles) {
    // Handle single image field
    if (pulseFiles.image) {
      updatedData.image = pulseFiles.image;
    }

    // Handle multiple images in options
    if (pulseFiles.options && Array.isArray(pulseFiles.options)) {
      if (!updatedData.options) updatedData.options = [];

      // Merge uploaded images with existing URL options
      pulseFiles.options.forEach((imageUrl: string, index: number) => {
        if (imageUrl) {
          updatedData.options[index] = imageUrl;
        }
      });
    }
  }

  return updatedData;
}


export const createBlankDailyPulse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const dailyPulseId = await dailyPulseService.createBlankDailyPulse(companyId);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: dailyPulseId,
    });
  } catch (error) {
    next(error);
  }
};


export const getDailyPulseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dailyPulseId } = req.params;
    if (!dailyPulseId) {
      return next(new AppError('dailyPulseId is required', StatusCodes.BAD_REQUEST));
    }

    const dailyPulse = await dailyPulseService.getDailyPulseById(dailyPulseId);
    if (!dailyPulse) {
      return next(new AppError('Daily Pulse not found', StatusCodes.NOT_FOUND));
    }

    const pulseIds = dailyPulse.pulses.map(p => p.refId); // these should be the actual ObjectIds of the referenced documents

    // Fetch all relevant question and infoCard documents
    const [questions, infoCards] = await Promise.all([
      questionService.getAllQuestions(pulseIds),
      infoCardService.getAllInfoCards(pulseIds),
    ]);

    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
    const infoCardMap = new Map(infoCards.map(c => [c._id.toString(), c]));

    // Construct enriched pulse objects
    const pulseItems = dailyPulse.pulses.map(p => {
      const idStr = p.refId.toString();
      if (p.type === 'question' && questionMap.has(idStr)) {
        // Convert Mongoose document to plain JS object to remove internal fields
        const question = questionMap.get(idStr);
        let data = question?.toObject();
        return {
          type: 'question',
          ...data
        };
      } else if (p.type === 'infoCard' && infoCardMap.has(idStr)) {
        const infoCard = infoCardMap.get(idStr);
        let data = infoCard?.toObject();
        return {
          type: 'infoCard',
          ...data,
        };
      } else {
        return {
          type: p.type,
        };
      }
    });

    // Attach enriched pulses to the response
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...dailyPulse.toObject(),
        pulses: pulseItems,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteDailyPulseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dailyPulseId } = req.body;
    if (!dailyPulseId) {
      return next(new AppError('dailyPulseId is required', StatusCodes.BAD_REQUEST));
    }

    await dailyPulseService.deleteDailyPulseById(dailyPulseId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Daily pulse deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getDailyPulseStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    const dailyPulses = await dailyPulseService.getAllDailyPulses(companyId);

    const stats = {
      [Status.Published]: 0,
      [Status.Drafts]: 0,
      [Status.Archived]: 0,
      total: dailyPulses.length,
    };

    dailyPulses.forEach(pulse => {
      if (pulse.status === Status.Published) {
        stats[Status.Published]++;
      } else if (pulse.status === Status.Drafts) {
        stats[Status.Drafts]++;
      } else if (pulse.status === Status.Archived) {
        stats[Status.Archived]++;
      }
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const archievedailyPulseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dailyPulseId } = req.params;
    console.log("Archieve daily pulse controller.");
    const dailyPulse = await dailyPulseService.archieveDailyPulseById(dailyPulseId);

    res.status(StatusCodes.OK).json({
      success: 'success',
      message: dailyPulse.message
    });
  } catch (error) {
    console.error('Error in archieving dailyPulse:', error);
    next(new AppError('Failed to archieve dailyPulse', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};


export const searchDailyPulses = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await SearchHelper.search(searchConfigs.dailyPulse, req.query, req?.user.companyId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};


export const getTodayDailyPulseEngagement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return next(new AppError('Company ID is required', StatusCodes.BAD_REQUEST));
    }

    // Get today's date and today's daily pulse
    const today = generateTodayDate();
    const dailyPulse = await DailyPulse.findOne({
      publishOn: today,
      company: companyId,
      status: Status.Published,
    });

    if (!dailyPulse) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'No daily pulse found for today.',
        engagementRatio: 0,
        performedCount: 0,
      });
      return;
    }

    // Separate question and infoCard IDs
    const questionIds: mongoose.Types.ObjectId[] = [];
    const infoCardIds: mongoose.Types.ObjectId[] = [];
    dailyPulse.pulses.forEach((pulse: any) => {
      if (pulse.type === PulseType.Question) {
        questionIds.push(pulse.refId);
      } else if (pulse.type === PulseType.InfoCard) {
        infoCardIds.push(pulse.refId);
      }
    });

    // Get all users in the company
    const { users } = await userService.getAllUsersWithDetails(companyId);
    const userIds = users.map((u: any) => u._id);

    // For each user, check if they have responded to all questions and/or given feedback for all infoCards
    let performedCount = 0;

    await Promise.all(
      userIds.map(async (userId: mongoose.Types.ObjectId) => {
        let hasPerformed = false;

        // Check questions
        if (questionIds.length > 0) {
          const responses = await questionService.getUserResponsesForQuestions(userId, questionIds);
          if (responses && responses.length === questionIds.length) {
            hasPerformed = true;
          }
        }

        // Check infoCards (if no questions, check only infoCards)
        if (!hasPerformed && infoCardIds.length > 0) {
          const feedbacks = await infoCardService.getUserFeedbackForInfoCards(userId, infoCardIds);
          if (feedbacks && feedbacks.length === infoCardIds.length) {
            hasPerformed = true;
          }
        }

        // If both questions and infoCards exist, require both to be completed
        if (questionIds.length > 0 && infoCardIds.length > 0) {
          const responses = await questionService.getUserResponsesForQuestions(userId, questionIds);
          const feedbacks = await infoCardService.getUserFeedbackForInfoCards(userId, infoCardIds);
          if (
            responses &&
            responses.length === questionIds.length &&
            feedbacks &&
            feedbacks.length === infoCardIds.length
          ) {
            hasPerformed = true;
          } else {
            hasPerformed = false;
          }
        }

        if (hasPerformed) performedCount++;
      })
    );

    const totalUsers = userIds.length;
    const engagementRatio = totalUsers > 0 ? performedCount / totalUsers : 0;

    res.status(StatusCodes.OK).json({
      performedCount,
      engagementRatio,
    });
  } catch (error) {
    next(error);
  }
};