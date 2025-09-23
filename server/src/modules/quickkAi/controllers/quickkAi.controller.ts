import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AIModuleService, AIDailyPulseService, ChatService, AIDescriptionService } from '../services/quickkAi.service';
import ModuleService from '../../learning/services/module.service';
import QuestionService from '../../questions/service/question.service';
import { ModuleType } from '../../learning/types/enums';
import AppError from '../../../utils/appError';
import { DailyPulseCreationRequest, ModuleCreationRequest, DescriptionImprovementRequest } from '../types/interfaces';
import DailyPulseService from '../../dailyPulse/services/dailyPulse.Service';
import InfoCardService from '../../questions/service/question.infoCard.service';
import { PulseType, Status } from '../../dailyPulse/types/enum';

const aiModuleService = new AIModuleService();
const moduleService = new ModuleService();
const questionService = new QuestionService();
const aiDailyPulseService = new AIDailyPulseService();
const dailyPulseService = new DailyPulseService();
const infoCardService = new InfoCardService();
const chatService = new ChatService();
const aiDescriptionService = new AIDescriptionService();


const validateModuleData = (moduleData: ModuleCreationRequest): void => {
    const { type, title, questionsCount, assessmentCount } = moduleData;

    if (!title || title.trim().length === 0) {
        throw new AppError('Module title is required', StatusCodes.BAD_REQUEST);
    }

    if (title.length > 100) {
        throw new AppError('Module title must be less than 100 characters', StatusCodes.BAD_REQUEST);
    }

    if (!type || !Object.values(ModuleType).includes(type)) {
        throw new AppError('Valid module type is required', StatusCodes.BAD_REQUEST);
    }

    if (!assessmentCount || assessmentCount < 1 || assessmentCount > 20) {
        throw new AppError('Assessment count must be between 1 and 20', StatusCodes.BAD_REQUEST);
    }

    if (type === ModuleType.QUESTION) {
        if (!questionsCount || questionsCount < 1 || questionsCount > 20) {
            throw new AppError('Questions count must be between 1 and 20 for question type modules', StatusCodes.BAD_REQUEST);
        }
    }

    if (moduleData.duration) {
        const durationRegex = /^\d+\s*(min|mins|minute|minutes|hr|hrs|hour|hours)$/i;
        if (!durationRegex.test(moduleData.duration.trim())) {
            throw new AppError('Duration format is invalid. Use format like "10 min" or "1 hr"', StatusCodes.BAD_REQUEST);
        }
    }
};

export const createAIModule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const moduleData: ModuleCreationRequest = req.body;

        validateModuleData(moduleData);

        console.log('Starting AI module creation for:', moduleData.title);

        const aiResponse = await aiModuleService.generateModuleContent(moduleData);
        // console.log("aiResponse----->>>> ",aiResponse);

        const moduleId = await moduleService.createModuleWithUserData(
            moduleData.type || ModuleType.QUESTION,
            moduleData?.title || "New Module",
            moduleData.duration || "2 min"
        );
        const moduleObjectId = new mongoose.Types.ObjectId(moduleId);

        console.log('Created module with  raw data woith ID:', moduleId);

        let contentQuestions: any[] = [];
        let assessmentQuestions: any[] = [];

        if (moduleData.type === ModuleType.QUESTION && aiResponse.contentQuestions) {
            contentQuestions = aiResponse.contentQuestions.map(q => ({
                ...q,
                _id: undefined
            }));
        }

        if (aiResponse.assessmentQuestions) {
            assessmentQuestions = aiResponse.assessmentQuestions.map(q => ({
                ...q,
                _id: undefined
            }));
        }

        let content: any = undefined;
        if (moduleData.type === ModuleType.VIDEO) {
            content = aiResponse.videoUrl;
            console.log("url feeded");
        } else {
            content = contentQuestions;
        }

        console.log('Updating module with generated content...');

        const updatedModule = await moduleService.updateModule(
            moduleObjectId,
            content,
            moduleData.title || 'AI Generated Module',
            assessmentQuestions,
            questionService,
            moduleData.type || ModuleType.QUESTION,
            moduleData.duration || '10 min'
        );

        console.log('Successfully created AI module:', updatedModule._id);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'AI module created successfully',
            data: {
                moduleId: updatedModule._id,
                title: updatedModule.title,
                type: updatedModule.type,
                duration: updatedModule.duration,
                contentCount: moduleData.type === ModuleType.VIDEO ? 1 : contentQuestions.length,
                assessmentCount: assessmentQuestions.length,
                completionStatus: updatedModule.completionStatus
            }
        });
    } catch (error: any) {
        console.error('Error in createAIModule:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to create AI module'
            });
        }
    }
};

const validateDailyPulseData = (pulseData: DailyPulseCreationRequest): void => {
    const { topic, pulseCount, starsAwarded } = pulseData;

    if (!topic || topic.trim().length === 0) {
        throw new AppError('Topic is required', StatusCodes.BAD_REQUEST);
    }

    if (topic.length > 200) {
        throw new AppError('Topic must be less than 200 characters', StatusCodes.BAD_REQUEST);
    }

    if (!pulseCount || pulseCount < 1 || pulseCount > 10) {
        throw new AppError('Pulse count must be between 1 and 10', StatusCodes.BAD_REQUEST);
    }

    if (!starsAwarded || starsAwarded < 1 || starsAwarded > 100) {
        throw new AppError('Stars awarded must be between 1 and 100', StatusCodes.BAD_REQUEST);
    }

};

export const createAIDailyPulse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pulseData: DailyPulseCreationRequest = req.body;
        const companyId = req.user?.companyId;
        validateDailyPulseData(pulseData);

        console.log('Starting AI daily pulse creation for topic:', pulseData.topic);

        // Generate AI content
        const aiResponse = await aiDailyPulseService.generateDailyPulseContent(pulseData);
        console.log('AI response received with', aiResponse.infoCards.length, 'info cards and', aiResponse.questions.length, 'questions');

        // Create blank daily pulse
        const dailyPulseId = await dailyPulseService.createBlankDailyPulse(companyId);
        console.log('Created blank daily pulse with ID:', dailyPulseId);

        // Create info cards and questions
        const createdPulses: any[] = [];

        // Create info cards
        for (const infoCardData of aiResponse.infoCards) {
            try {
                const createdInfoCard = await infoCardService.createInfoCard({
                    title: infoCardData.title,
                    content: infoCardData.content,
                    wantFeedback: infoCardData.wantFeedback,
                    score: infoCardData.score || 10
                });

                createdPulses.push({
                    refId: createdInfoCard._id,
                    type: PulseType.InfoCard
                });

                console.log('Created info card:', createdInfoCard._id);
            } catch (error) {
                console.error('Error creating info card:', error);
                throw new AppError('Failed to create info card', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        // Create questions
        for (const questionData of aiResponse.questions) {
            try {
                const createdQuestion = await questionService.createQuestion({
                    qType: questionData.qType as any,
                    questionText: questionData.questionText,
                    questionOptions: questionData.questionOptions,
                    options: questionData.options,
                    correctAnswer: questionData.correctAnswer,
                    score: questionData.score,
                    optionType: questionData.optionType,
                });

                createdPulses.push({
                    refId: createdQuestion._id,
                    type: PulseType.Question
                });

                console.log('Created question:', createdQuestion._id);
            } catch (error) {
                console.error('Error creating question:', error);
                throw new AppError('Failed to create question', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        // Update daily pulse with created content
        const updateData = {
            pulses: createdPulses,
            stars: pulseData.starsAwarded,
            status: Status.Drafts,
        };

        const updatedDailyPulse = await dailyPulseService.updateDailyPulse(dailyPulseId, updateData);
        console.log('Successfully created AI daily pulse:', updatedDailyPulse?._id);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'AI daily pulse created successfully',
            data: {
                dailyPulseId: updatedDailyPulse?._id,
                topic: pulseData.topic,
                totalPulses: createdPulses.length,
                infoCardsCount: aiResponse.infoCards.length,
                questionsCount: aiResponse.questions.length,
                stars: pulseData.starsAwarded,
                publishOn: updatedDailyPulse?.publishOn,
                status: updatedDailyPulse?.status
            }
        });

    } catch (error) {
        console.error('Error in createAIDailyPulse:', error);

        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to create AI daily pulse'
            });
        }
    }
};

export const getModuleCreationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { moduleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            throw new AppError('Invalid module ID', StatusCodes.BAD_REQUEST);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Module creation completed',
            data: {
                moduleId,
                status: 'completed'
            }
        });
    } catch (error) {
        console.error('Error in getModuleCreationStatus:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to get module status'
            });
        }
    }
};


// Create new chat
export const createChat = async (req: Request, res: Response) => {
    try {
        const { title, chatType } = req.body;
        const adminId = req.user?.id;
        const company = req.user?.companyId;

        if (!adminId || !company) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        const chat = await chatService.createChat({
            adminId: new mongoose.Types.ObjectId(adminId),
            title,
            company: new mongoose.Types.ObjectId(company),
            chatType,
        });

        res.status(201).json({
            success: true,
            message: 'Chat created successfully',
            data: { chat },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Get chat by ID
export const getChatById = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const adminId = req.user?.id;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid chat ID',
            });
        }

        const chat = await chatService.getChatById(
            chatId,
            new mongoose.Types.ObjectId(adminId)
        );

        if (!chat) {
            res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chat retrieved successfully',
            data: { chat },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Get all chats for admin
export const getChatsByAdmin = async (req: Request, res: Response) => {
    try {
        const adminId = req.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        const result = await chatService.getChatsByAdmin(
            new mongoose.Types.ObjectId(adminId),
            page,
            limit
        );

        res.status(200).json({
            success: true,
            message: 'Chats retrieved successfully',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update chat messages
export const updateChatMessages = async (req: Request, res: Response) => {
    try {

        const { chatId } = req.params;
        const { messages } = req.body;
        const adminId = req.user?.id;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        const updatedChat = await chatService.updateChatMessages(
            chatId,
            messages,
            new mongoose.Types.ObjectId(adminId)
        );

        if (!updatedChat) {
            res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chat messages updated successfully',
            data: { chat: updatedChat },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Update chat on completion (when module/daily pulse is created)
export const updateChatOnCompletion = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const { title, createdModuleId, createdDailyPulseId, chatType, status, messages } = req.body;
        const adminId = req.user?.id;
        const companyId = req.user?.companyId;
        if (chatId === "Temp") {
            const chat = await chatService.createNewChat({ adminId, companyId });
            res.status(201).json({
                success: true,
                message: 'Chat created successfully',
                data: { chat },
            });
            return;
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (createdModuleId) updateData.createdModuleId = new mongoose.Types.ObjectId(createdModuleId);
        if (createdDailyPulseId) updateData.createdDailyPulseId = new mongoose.Types.ObjectId(createdDailyPulseId);
        if (chatType) updateData.chatType = chatType;
        if (status) updateData.status = status;
        if (messages) updateData.messages = messages;

        const updatedChat = await chatService.updateChatOnCompletion(
            chatId,
            new mongoose.Types.ObjectId(adminId),
            updateData
        );

        if (!updatedChat) {
            res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Chat updated successfully',
            data: { chat: updatedChat },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Add message to chat
export const addMessageToChat = async (req: Request, res: Response) => {
    try {

        const { chatId } = req.params;
        const { message } = req.body;
        const adminId = req.user?.id;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        const updatedChat = await chatService.addMessageToChat(
            chatId,
            message,
            new mongoose.Types.ObjectId(adminId)
        );

        if (!updatedChat) {
            res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Message added successfully',
            data: { chat: updatedChat },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Delete chat
export const deleteChat = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const adminId = req.user?.id;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        const deleted = await chatService.deleteChat(
            chatId,
            new mongoose.Types.ObjectId(adminId)
        );

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chat deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Search chats
export const searchChats = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const searchTerm = Array.isArray(q) ? q[0] : q;
        const adminId = req.user?.id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        if (!adminId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        if (!searchTerm || typeof searchTerm !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Search term is required',
            });
            return;
        }

        const result = await chatService.searchChatsByTitle(
            new mongoose.Types.ObjectId(adminId),
            searchTerm,
            page,
            limit
        );

        res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createNewChat = async (req: Request, res: Response) => {
    try {
        const adminId = req.user?.id;
        const companyId = req.user?.companyId;

        if (!adminId || !companyId) {
            res.status(400).json({
                success: false,
                message: 'adminId and companyId are required',
            });
        }

        const chat = await chatService.createNewChat({ adminId, companyId });

        res.status(201).json({
            success: true,
            message: 'Chat created successfully',
            data: chat?._id,
        });
    } catch (error) {
        console.error('Error in creating new Chat :', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create new chat',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const improveEventDescription = async (req: Request, res: Response): Promise<void> => {
    try {
        const adminId = req.user?.id;
        const companyId = req.user?.companyId;

        if (!adminId || !companyId) {
            res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
            return;
        }

        const { originalDescription, eventTitle, eventType }: DescriptionImprovementRequest = req.body;

        // Validate request body
        if (!originalDescription || !eventTitle || !eventType) {
            res.status(400).json({
                success: false,
                message: 'originalDescription, eventTitle, and eventType are required',
            });
            return;
        }

        // Validate event type
        if (!['ONLINE', 'OFFLINE'].includes(eventType)) {
            res.status(400).json({
                success: false,
                message: 'eventType must be either ONLINE or OFFLINE',
            });
            return;
        }

        // Validate description length
        if (originalDescription.trim().length < 10) {
            res.status(400).json({
                success: false,
                message: 'Description must be at least 10 characters long',
            });
            return;
        }

        if (originalDescription.length > 1000) {
            res.status(400).json({
                success: false,
                message: 'Description must be less than 1000 characters long',
            });
            return;
        }

        // Improve the description using AI
        const improvedDescription = await aiDescriptionService.improveEventDescription({
            originalDescription,
            eventTitle,
            eventType
        });

        res.status(200).json({
            success: true,
            message: 'Description improved successfully',
            data: {
                improvedDescription,
                originalLength: originalDescription.length,
                improvedLength: improvedDescription.length,
            },
        });
    } catch (error: any) {
        console.error('Error improving event description:', error);
        
        // Handle specific AI service errors
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Failed to improve description',
            error: error.message || 'Unknown error',
        });
    }
};
