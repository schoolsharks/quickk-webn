import { Request, Response, NextFunction } from 'express';
import ModuleService from '../services/module.service';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import QuestionService from '../../questions/service/question.service';
import UserService from '../../user/service/user.service';
import LearningService from '../services/learning.service';
import UserVideo from '../model/user.video.model';

const moduleService = new ModuleService();
const userService = new UserService();
const learningService = new LearningService();
const questionService = new QuestionService();

// Controller to get modules by IDs
export const getModuleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: moduleId } = req.params;
        const userId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return next(new AppError('Invalid module ID', StatusCodes.BAD_REQUEST));
        }

        const module = await moduleService.getModuleById(new mongoose.Types.ObjectId(moduleId), questionService);
        // get if video for video module is watched or not.

        let moduleWithVideoStatus: any = module;
        if (module.type === "video") {
            const Video = await UserVideo.findOne({
                user: userId,
                videoId: moduleId
            });

            moduleWithVideoStatus = {
                ...module,
                isVideoWatched: Video?.isVideoWatched || false,
            };
        }



        res.status(StatusCodes.OK).json({
            status: 'success',
            data: moduleWithVideoStatus,
        });
    } catch (error) {
        console.error('Error in getModuleById:', error);
        next(new AppError('An unexpected error occurred while fetching the module', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};




// Controller to get assessment questions by IDs
export const getAssessmentQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id: moduleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return next(new AppError('Invalid module ID', StatusCodes.BAD_REQUEST));
        }

        const module = await moduleService.getModuleById(new mongoose.Types.ObjectId(moduleId), questionService);

        if (!module) {
            return next(new AppError('Module not found', StatusCodes.NOT_FOUND));
        }

        const assessmentQuestionIds = module.assessment;

        if (!assessmentQuestionIds || assessmentQuestionIds.length === 0) {
            res.status(StatusCodes.OK).json({
                status: 'FAIL',
                data: [],
            });
            return;
        }

        const questions = await questionService.getAllQuestions(assessmentQuestionIds);

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: questions,
        });
    } catch (error) {
        console.error('Error in getAssessmentQuestions:', error);
        next(new AppError('An unexpected error occurred while fetching assessment questions', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const checkQuestionResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { questionId, response: userResponse } = req.body;

        if (!questionId) {
            return next(new AppError('questionId is required', StatusCodes.BAD_REQUEST));
        }
        if (typeof userResponse === 'undefined') {
            return next(new AppError('response is required', StatusCodes.BAD_REQUEST));
        }

        const question = await questionService.getQuestionById(questionId);

        const isCorrect = userResponse === question.correctAnswer;

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                isCorrect,
                correctAnswer: question.correctAnswer
            }
        });
    } catch (error) {
        console.error('Error in checkQuestionResponse:', error);
        next(new AppError('Error checking question response', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};



export const submitLearningResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refId, questionResponse } = req.body;
        const user = req.user?.id;

        if (!user) {
            return next(new AppError('User is required', StatusCodes.BAD_REQUEST));
        }
        if (!questionResponse) {
            return next(new AppError('questionResponse is required', StatusCodes.BAD_REQUEST));
        }
        if (!refId) {
            return next(new AppError('refId is required', StatusCodes.BAD_REQUEST));
        }

        const question = await questionService.getQuestionById(refId);
        if (!question.score) {
            question.score = 0;
        }

        const isCorrect = questionResponse === question.correctAnswer;
        // Check if the response matches the correct answer
        if (isCorrect) {
            // Award stars to the user
            const starsAwarded = await userService.awardStars(
                new mongoose.Types.ObjectId(user),
                question.score
            );
        }


        const result = await questionService.collectResponse({
            user: new mongoose.Types.ObjectId(user),
            question: refId,
            response: questionResponse,
            starsAwarded: isCorrect ? question.score : 0,
        });
        await userService.updateLearningStreak(user);


        res.status(StatusCodes.CREATED).json({
            success: true,
            data: result,
            message: 'Response submitted successfully. awarded stars: ' + question.score,
        });
    } catch (error) {
        console.error('Error in submitLearningResponse:', error);
        next(new AppError('An unexpected error occurred while submitting the learning response', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};



export const getModuleComplete = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { currentModuleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(currentModuleId)) {
            return next(new AppError('Invalid module ID', StatusCodes.BAD_REQUEST));
        }

        // Find the current module to get its learningId
        const currentModule = await moduleService.getModuleById(
            new mongoose.Types.ObjectId(currentModuleId),
            new QuestionService()
        );

        if (!currentModule) {
            return next(new AppError('Current module not found', StatusCodes.NOT_FOUND));
        }

        // Calculate total stars awarded for the current module
        const totalStarsAwarded = await moduleService.calculateTotalStarsAwarded(
            new mongoose.Types.ObjectId(currentModuleId)
        );

        // Find the learning that contains this module
        const learning = await learningService.getLearningByModuleId(currentModuleId);

        if (!learning) {
            return next(new AppError('Learning not found for this module', StatusCodes.NOT_FOUND));
        }

        // Find the index of the current module
        const moduleIndex = learning.modules.findIndex(
            m => m.toString() === currentModuleId
        );

        if (moduleIndex === -1) {
            return next(new AppError('Module not found in learning', StatusCodes.NOT_FOUND));
        }

        // Check if there is a next module
        if (moduleIndex < learning.modules.length - 1) {
            const nextModuleId = learning.modules[moduleIndex + 1];

            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    nextModuleId,
                    totalStarsAwarded,
                    duration: currentModule.duration
                }
            });
        } else {

            // No next module in this learning, check if there's a next learning
            if (typeof learning.week === 'number') {
                const nextLearning = await learningService.getNextLearning(learning.week);

                if (nextLearning && nextLearning.modules.length > 0) {
                    const nextModule = await moduleService.getModuleById(
                        nextLearning.modules[0],
                        new QuestionService()
                    );

                    res.status(StatusCodes.OK).json({
                        success: true,
                        data: {
                            nextModuleId: nextModule._id,
                            totalStarsAwarded
                        },
                        message: 'Moving to the next learning unit'
                    });
                } else {
                    res.status(StatusCodes.OK).json({
                        success: true,
                        data: {
                            nextModuleId: null,
                            totalStarsAwarded
                        },
                        message: 'All modules completed'
                    });
                }
            } else {
                res.status(StatusCodes.OK).json({
                    success: true,
                    data: {
                        nextModuleId: null,
                        totalStarsAwarded
                    },
                    message: 'All modules completed'
                });
            }
        }
    } catch (error) {
        console.error('Error in getNextModule:', error);
        next(new AppError('An unexpected error occurred while fetching the next module', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const markModuleCompletedIfAssessmentAnswered = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { moduleId } = req.body;

        if (!userId) {
            return next(new AppError('User is required', StatusCodes.BAD_REQUEST));
        }


        const result = await moduleService.markModuleCompletedIfAssessmentAnswered(
            userId,
            moduleId
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error('Error in markModuleCompletedIfAssessmentAnswered:', error);
        next(new AppError('Error marking module as completed', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const markVideoCompleted = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { videoId } = req.body;

        if (!userId) {
            return next(new AppError('User is required', StatusCodes.BAD_REQUEST));
        }
        if (!videoId) {
            return next(new AppError('videoId is required', StatusCodes.BAD_REQUEST));
        }

        const result = await moduleService.markVideoCompleted(
            userId,
            videoId
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error in markVideoCompleted:', error);
        next(new AppError('Error marking video as completed', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

// export const updateModule = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const { moduleId, content, assessment, type, duration } = req.body;
//         // Add this after extracting req.body:
//         const uploadedFiles = req.files as Express.Multer.File[];
//         const fileMap = new Map();
//         console.log("assessment:", assessment)

//         if (!moduleId) {
//             return next(new AppError('moduleId is required', StatusCodes.BAD_REQUEST));
//         }
//         if (!type) {
//             return next(new AppError('type is required', StatusCodes.BAD_REQUEST));
//         }
//         if (!duration) {
//             return next(new AppError('duration is required', StatusCodes.BAD_REQUEST));
//         }


//         // Create a map of uploaded files by their fieldname
//         if (uploadedFiles && uploadedFiles.length > 0) {
//             uploadedFiles.forEach((file: any) => {
//                 fileMap.set(file.fieldname, file.location); // S3 URL
//             });
//         }

//         // Modify your assessmentData mapping:
//         const assessmentData = assessment.map((con: any, index: number) => {
//             let imageUrl = '';

//             // Check if there's an uploaded file for this question
//             const fileKey = `question_${index}_image`;
//             if (fileMap.has(fileKey)) {
//                 imageUrl = fileMap.get(fileKey);
//             } else if (con.image && con.image.type === 'url') {
//                 imageUrl = con.image.url;
//             }

//         });

//         const contentData = content.map((con: any) => ({
//             questionText: con.content,
//             questionSubHeading: con.heading || "",
//             questionSubText: con.subHeading || "",
//             options: ["right", "wrong"],
//             correctAnswer: con.correctAnswer || "",
//             explanation: con.explanation || "",
//             qType: "TWO_CHOICE",
//             optionType: "correct-incorrect",
//         }))

//         const updatedModule = await moduleService.updateModule(
//             moduleId,
//             contentData,
//             assessmentData,
//             questionService,
//             type,
//             duration
//         );

//         res.status(StatusCodes.OK).json({
//             success: true,
//             data: updatedModule,
//             message: 'Module updated with questions successfully'
//         });
//     } catch (error) {
//         console.error('Error in updateModuleWithQuestions:', error);
//         next(new AppError('Error updating module with questions', StatusCodes.INTERNAL_SERVER_ERROR));
//     }
// };



export const updateModule = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { moduleId, content, title, assessment, type, duration } = req.body;

        // Add this after extracting req.body:
        const uploadedFiles = req.files as Express.Multer.File[];
        const fileMap = new Map();

        // console.log("assessment:", assessment);

        if (!moduleId) {
            return next(new AppError('moduleId is required', StatusCodes.BAD_REQUEST));
        }
        if (!type) {
            return next(new AppError('type is required', StatusCodes.BAD_REQUEST));
        }
        if (!duration) {
            return next(new AppError('duration is required', StatusCodes.BAD_REQUEST));
        }

        // Create a map of uploaded files by their fieldname
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach((file: any) => {
                fileMap.set(file.fieldname, file.location); // S3 URL
            });
        }

        // Parse assessment data if it's a string
        let assessmentArray;
        try {
            assessmentArray = typeof assessment === 'string' ? JSON.parse(assessment) : assessment;
        } catch (error) {
            return next(new AppError('Invalid assessment data format', StatusCodes.BAD_REQUEST));
        }
        // console.log("assessmentArray-------->>>:", assessmentArray);

        // Parse content data if it's a string
        let contentArray;
        try {
            contentArray = typeof content === 'string' ? JSON.parse(content) : content;
        } catch (error) {
            return next(new AppError('Invalid content data format', StatusCodes.BAD_REQUEST));
        }
        // console.log("content-------->>>:", contentArray);


        // Modify your assessmentData mapping:
        const assessmentData = assessmentArray.map((question: any, index: number) => {
            let imageUrl = '';

            // Check if there's an uploaded file for this question
            const fileKey = `question_${index}_image`;
            if (fileMap.has(fileKey)) {
                imageUrl = fileMap.get(fileKey);
            } else if (question.image) {
                imageUrl = question.image;
            }

            // Return the mapped assessment question
            return {
                _id: question._id || "",
                questionText: question.questionText || question.question || '',
                questionSubHeading: question.questionSubHeading || question.subHeading || '',
                questionSubText: question.questionSubText || question.subText || '',
                options: question.options || [],
                correctAnswer: question.correctAnswer || '',
                explanation: question.explanation || '',
                qType: question.qType || question.type || 'MULTIPLE_CHOICE',
                optionType: question.optionType || 'mcq',
                ...question,
                image: imageUrl || undefined
            };
        });

        const contentData = contentArray.map((con: any) => ({
            _id: con._id || "",
            questionText: con.content || con.questionText || '',
            questionSubHeading: con.heading || con.questionSubHeading || '',
            questionSubText: con.subHeading || con.questionSubText || '',
            options: con.options || ["right", "wrong"],
            correctAnswer: con.correctAnswer || '',
            explanation: con.explanation || '',
            qType: con.qType || "TWO_CHOICE",
            optionType: con.optionType || "correct-incorrect",
        }));

        const updatedModule = await moduleService.updateModule(
            moduleId,
            contentData,
            title,
            assessmentData,
            questionService,
            type,
            duration,
        );

        res.status(StatusCodes.OK).json({
            success: true,
            data: updatedModule,
            message: 'Module updated with questions successfully'
        });

    } catch (error) {
        console.error('Error in updateModuleWithQuestions:', error);
        next(new AppError('Error updating module with questions', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getCompleteModuleById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { moduleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return next(new AppError('Invalid module ID', StatusCodes.BAD_REQUEST));
        }

        const completeModule = await moduleService.getCompleteModuleById(
            new mongoose.Types.ObjectId(moduleId),
            questionService
        );

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: completeModule,
        });
    } catch (error) {
        console.error('Error in getCompleteModuleById:', error);
        next(new AppError('An unexpected error occurred while fetching the complete module', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const createBlankModule = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        const result = await moduleService.createBlankModule();

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: result,
            message: 'Blank module created successfully'
        });
    } catch (error) {
        console.error('Error in createBlankModuleWithTitle:', error);
        next(new AppError('Failed to create blank module', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const deleteModuleById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { moduleId } = req.body;
        console.log(moduleId);

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return next(new AppError('Invalid module ID', StatusCodes.BAD_REQUEST));
        }

        const result = await moduleService.deleteModuleById(new mongoose.Types.ObjectId(moduleId));

        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('Error in deleteModuleById:', error);
        next(new AppError('Error deleting module', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};