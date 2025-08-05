import { GoogleGenerativeAI } from '@google/generative-ai';
import { StatusCodes } from 'http-status-codes';
import { ModuleType } from '../../learning/types/enums';
import { OptionType, QuestionType } from '../../questions/types/enum';
import AppError from '../../../utils/appError';
import { DailyPulseData, GeminiDailyPulseResponse, GeminiModuleResponse, ModuleData } from '../types/interfaces';
import buildPrompt from '../prompts/buildPrompt.module';
import buildDailyPulsePrompt from '../prompts/buildPrompt.dailyPulse';
import mongoose, { Types } from 'mongoose';
import { Chat, IChat, IMessage } from '../model/chat.model';


export class AIModuleService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private maxRetries = 3;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new AppError('Gemini API key not found', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async generateModuleContent(moduleData: ModuleData): Promise<GeminiModuleResponse> {
        const prompt = buildPrompt(moduleData);

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                // console.log("response---------->>", text);

                const parsedResponse = this.parseAndValidateResponse(text, moduleData);
                return parsedResponse;
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);

                if (attempt === this.maxRetries) {
                    throw new AppError(
                        `Failed to generate module content after ${this.maxRetries} attempts`,
                        StatusCodes.INTERNAL_SERVER_ERROR
                    );
                }

                // Wait before retry (exponential backoff)
                await this.delay(1000 * attempt);
            }
        }

        throw new AppError('Failed to generate module content', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private parseAndValidateResponse(responseText: string, moduleData: ModuleData): GeminiModuleResponse {
        try {
            // Clean the response text
            const cleanedText = responseText.replace(/```json|```/g, '').trim();
            const parsedResponse = JSON.parse(cleanedText);

            // Validate response structure
            this.validateResponse(parsedResponse, moduleData);

            return parsedResponse;
        } catch (error) {
            console.error('Failed to parse Gemini response:', error);
            throw new AppError('Invalid response format from AI service', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    private validateResponse(response: any, moduleData: ModuleData): void {
        const { type, questionsCount = 0, assessmentCount = 0 } = moduleData;

        // Check if response has required fields
        if (!response.assessmentQuestions || !Array.isArray(response.assessmentQuestions)) {
            throw new Error('Assessment questions missing or invalid');
        }

        if (response.assessmentQuestions.length !== assessmentCount) {
            throw new Error(`Expected ${assessmentCount} assessment questions, got ${response.assessmentQuestions.length}`);
        }

        if (type === ModuleType.VIDEO) {
            if (!response.videoUrl || typeof response.videoUrl !== 'string') {
                throw new Error('Video URL missing or invalid');
            }
        } else {
            if (!response.contentQuestions || !Array.isArray(response.contentQuestions)) {
                throw new Error('Content questions missing or invalid');
            }

            if (response.contentQuestions.length !== questionsCount) {
                throw new Error(`Expected ${questionsCount} content questions, got ${response.contentQuestions.length}`);
            }

            // Validate content questions are TWO_CHOICE
            response.contentQuestions.forEach((q: any, index: number) => {
                if (q.qType !== QuestionType.TWO_CHOICE) {
                    throw new Error(`Content question ${index + 1} must be TWO_CHOICE type`);
                }
                if (q.optionType !== OptionType.CORRECT_INCORRECT) {
                    throw new Error(`Content question ${index + 1} must have correct-incorrect optionType`);
                }
            });
        }

        // Validate all questions have required fields
        const allQuestions = [
            ...(response.contentQuestions || []),
            ...response.assessmentQuestions
        ];

        allQuestions.forEach((q: any, index: number) => {
            this.validateQuestionStructure(q, index);
        });
    }

    private validateQuestionStructure(question: any, index: number): void {
        const required = ['qType', 'questionText', 'correctAnswer', 'score'];

        for (const field of required) {
            if (question[field] === undefined || question[field] === null) {
                throw new Error(`Question ${index + 1} missing required field: ${field}`);
            }
        }

        // Validate question types
        if (!Object.values(QuestionType).includes(question.qType)) {
            throw new Error(`Question ${index + 1} has invalid qType: ${question.qType}`);
        }

        // Type-specific validations
        if (question.qType === QuestionType.MEMORY_MATCH) {
            if (!question.memoryPairs || !Array.isArray(question.memoryPairs)) {
                throw new Error(`Memory match question ${index + 1} missing memoryPairs`);
            }
        }

        if (question.qType === QuestionType.DRAG_ORDER) {
            if (!Array.isArray(question.correctAnswer)) {
                throw new Error(`Drag order question ${index + 1} correctAnswer must be array`);
            }
        }
    }


    private calculateQuestionDistribution(totalCount: number): { multipleChoice: number; dragOrder: number; memoryMatch: number } {
        if (totalCount === 0) return { multipleChoice: 0, dragOrder: 0, memoryMatch: 0 };

        // Ensure at least one of each type if count >= 3
        if (totalCount >= 3) {
            const remaining = totalCount - 3;
            const multipleChoice = 1 + Math.floor(remaining * 0.7);
            const dragOrder = 1 + Math.floor(remaining * 0.2);
            const memoryMatch = 1 + (remaining - Math.floor(remaining * 0.7) - Math.floor(remaining * 0.2));

            return { multipleChoice, dragOrder, memoryMatch };
        } else {
            // For small counts, distribute as evenly as possible
            return {
                multipleChoice: Math.ceil(totalCount * 0.7),
                dragOrder: Math.ceil(totalCount * 0.2),
                memoryMatch: Math.max(0, totalCount - Math.ceil(totalCount * 0.7) - Math.ceil(totalCount * 0.2))
            };
        }
    }
}


export class AIDailyPulseService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private maxRetries = 3;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new AppError('Gemini API key not found', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async generateDailyPulseContent(pulseData: DailyPulseData): Promise<GeminiDailyPulseResponse> {
        const prompt = buildDailyPulsePrompt(pulseData);

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                // console.log(text);

                const parsedResponse = this.parseAndValidateResponse(text, pulseData);
                return parsedResponse;
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);

                if (attempt === this.maxRetries) {
                    throw new AppError(
                        `Failed to generate daily pulse content after ${this.maxRetries} attempts`,
                        StatusCodes.INTERNAL_SERVER_ERROR
                    );
                }

                // Wait before retry (exponential backoff)
                await this.delay(1000 * attempt);
            }
        }

        throw new AppError('Failed to generate daily pulse content', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    private parseAndValidateResponse(responseText: string, pulseData: DailyPulseData): GeminiDailyPulseResponse {
        try {
            // Clean the response text
            const cleanedText = responseText.replace(/```json|```/g, '').trim();
            const parsedResponse = JSON.parse(cleanedText);

            // Validate response structure
            this.validateResponse(parsedResponse, pulseData);

            return parsedResponse;
        } catch (error) {
            console.error('Failed to parse Gemini response:', error);
            throw new AppError('Invalid response format from AI service', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    private validateResponse(response: any, pulseData: DailyPulseData): void {
        const { pulseCount = 0 } = pulseData;

        // Check if response has required fields
        if (!response.infoCards || !Array.isArray(response.infoCards)) {
            throw new Error('Info cards missing or invalid');
        }

        if (!response.questions || !Array.isArray(response.questions)) {
            throw new Error('Questions missing or invalid');
        }

        // Calculate expected distribution
        const distribution = this.calculatePulseDistribution(pulseCount);

        if (response.infoCards.length !== distribution.infoCards) {
            throw new Error(`Expected ${distribution.infoCards} info cards, got ${response.infoCards.length}`);
        }

        if (response.questions.length !== distribution.questions) {
            throw new Error(`Expected ${distribution.questions} questions, got ${response.questions.length}`);
        }

        // Validate info cards
        response.infoCards.forEach((card: any, index: number) => {
            this.validateInfoCardStructure(card, index);
        });

        // Validate questions
        response.questions.forEach((question: any, index: number) => {
            this.validateQuestionStructure(question, index);
        });
    }

    private validateInfoCardStructure(infoCard: any, index: number): void {
        const required = ['title', 'content'];

        for (const field of required) {
            if (!infoCard[field] || typeof infoCard[field] !== 'string') {
                throw new Error(`Info card ${index + 1} missing or invalid field: ${field}`);
            }
        }

        // Validate wantFeedback is boolean
        if (typeof infoCard.wantFeedback !== 'boolean') {
            throw new Error(`Info card ${index + 1} wantFeedback must be boolean`);
        }

        // Validate score if present
        if (infoCard.score !== undefined && (typeof infoCard.score !== 'number' || infoCard.score < 0)) {
            throw new Error(`Info card ${index + 1} score must be a positive number`);
        }
    }

    private validateQuestionStructure(question: any, index: number): void {
        const required = ['qType', 'questionText', 'questionOptions', 'options', 'correctAnswer', 'score', 'optionType'];

        for (const field of required) {
            if (question[field] === undefined || question[field] === null) {
                throw new Error(`Question ${index + 1} missing required field: ${field}`);
            }
        }

        // Validate qType is TWO_CHOICE
        if (question.qType !== 'TWO_CHOICE') {
            throw new Error(`Question ${index + 1} must be TWO_CHOICE type, got: ${question.qType}`);
        }

        // Validate arrays
        if (!Array.isArray(question.questionOptions) || question.questionOptions.length !== 2) {
            throw new Error(`Question ${index + 1} questionOptions must be array of 2 items`);
        }

        if (!Array.isArray(question.options) || question.options.length !== 2) {
            throw new Error(`Question ${index + 1} options must be array of 2 items`);
        }

        // Validate correctAnswer is one of the options
        if (!question.options.includes(question.correctAnswer)) {
            throw new Error(`Question ${index + 1} correctAnswer must be one of the options`);
        }

        // Validate score
        if (typeof question.score !== 'number' || question.score <= 0) {
            throw new Error(`Question ${index + 1} score must be a positive number`);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private calculatePulseDistribution(totalCount: number): { questions: number; infoCards: number } {
        if (totalCount === 0) return { questions: 0, infoCards: 0 };

        // 70% Questions, 30% InfoCards
        const questionsCount = Math.ceil(totalCount * 0.6);
        const infoCardsCount = totalCount - questionsCount;

        return { questions: questionsCount, infoCards: infoCardsCount };
    }
}

export class ChatService {

    // Create a new chat
    async createChat(data: {
        adminId: mongoose.Types.ObjectId;
        title?: string;
        company: mongoose.Types.ObjectId;
        chatType?: 'module' | 'dailyPulse' | 'general';
    }): Promise<IChat> {
        try {
            const newChat = new Chat({
                adminId: data.adminId,
                title: data.title || 'New Chat',
                company: data.company,
                chatType: data.chatType || 'general',
                messages: [],
            });

            return await newChat.save();
        } catch (error: any) {
            throw new Error(`Error creating chat: ${error.message}`);
        }
    }

    // Get chat by ID
    async getChatById(chatId: string, adminId: mongoose.Types.ObjectId): Promise<IChat | null> {
        try {
            const chat = await Chat.findOne({
                _id: chatId,
                adminId: adminId,
            }).populate('createdModuleId createdDailyPulseId');

            return chat;
        } catch (error: any) {
            throw new Error(`Error fetching chat: ${error.message}`);
        }
    }

    // Get all chats for an admin
    async getChatsByAdmin(
        adminId: mongoose.Types.ObjectId,
        page: number = 1,
        limit: number = 20
    ): Promise<{ chats: IChat[]; total: number; totalPages: number }> {
        try {
            const skip = (page - 1) * limit;
            const chats = await Chat.find({ adminId })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdModuleId', 'title type')
                .populate('createdDailyPulseId', 'stars pulses');

            const total = await Chat.countDocuments({ adminId });
            const totalPages = Math.ceil(total / limit);

            return {
                chats,
                total,
                totalPages,
            };
        } catch (error: any) {
            throw new Error(`Error fetching chats: ${error.message}`);
        }
    }

    // Update chat with new messages
    async updateChatMessages(
        chatId: string,
        messages: IMessage[],
        adminId: mongoose.Types.ObjectId
    ): Promise<IChat | null> {
        try {
            const updatedChat = await Chat.findOneAndUpdate(
                { _id: chatId, adminId },
                {
                    messages,
                    updatedAt: new Date(),
                },
                { new: true }
            ).populate('createdModuleId createdDailyPulseId');

            return updatedChat;
        } catch (error: any) {
            throw new Error(`Error updating chat messages: ${error.message}`);
        }
    }

    // Update chat when module/daily pulse is created
    async updateChatOnCompletion(
        chatId: string,
        adminId: mongoose.Types.ObjectId,
        data: {
            title?: string;
            createdModuleId?: mongoose.Types.ObjectId;
            createdDailyPulseId?: mongoose.Types.ObjectId;
            chatType?: 'module' | 'dailyPulse';
            status?: 'completed';
            messages?: IMessage[];
        }
    ): Promise<IChat | null> {
        try {
            const updateData: any = {
                updatedAt: new Date(),
                ...data,
            };

            const updatedChat = await Chat.findOneAndUpdate(
                { _id: chatId, adminId },
                updateData,
                { new: true }
            ).populate('createdModuleId createdDailyPulseId');

            return updatedChat;
        } catch (error: any) {
            throw new Error(`Error updating chat on completion: ${error.message}`);
        }
    }

    // Add single message to chat
    async addMessageToChat(
        chatId: string,
        message: IMessage,
        adminId: mongoose.Types.ObjectId
    ): Promise<IChat | null> {
        try {
            const updatedChat = await Chat.findOneAndUpdate(
                { _id: chatId, adminId },
                {
                    $push: { messages: message },
                    updatedAt: new Date(),
                },
                { new: true }
            );

            return updatedChat;
        } catch (error: any) {
            throw new Error(`Error adding message to chat: ${error.message}`);
        }
    }

    // Delete chat
    async deleteChat(chatId: string, adminId: mongoose.Types.ObjectId): Promise<boolean> {
        try {
            const result = await Chat.findOneAndDelete({
                _id: chatId,
                adminId,
            });

            return !!result;
        } catch (error: any) {
            throw new Error(`Error deleting chat: ${error.message}`);
        }
    }

    // Archive chat
    async archiveChat(chatId: string, adminId: mongoose.Types.ObjectId): Promise<IChat | null> {
        try {
            const updatedChat = await Chat.findOneAndUpdate(
                { _id: chatId, adminId },
                {
                    status: 'archived',
                    updatedAt: new Date(),
                },
                { new: true }
            );

            return updatedChat;
        } catch (error: any) {
            throw new Error(`Error archiving chat: ${error.message}`);
        }
    }

    // Search chats by title
    async searchChatsByTitle(
        adminId: mongoose.Types.ObjectId,
        searchTerm: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ chats: IChat[]; total: number; totalPages: number }> {
        try {
            const skip = (page - 1) * limit;

            const chats = await Chat.find({
                adminId,
                title: { $regex: searchTerm, $options: 'i' },
            })
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdModuleId', 'title type')
                .populate('createdDailyPulseId', 'stars pulses');

            const total = await Chat.countDocuments({
                adminId,
                title: { $regex: searchTerm, $options: 'i' },
            });

            const totalPages = Math.ceil(total / limit);

            return {
                chats,
                total,
                totalPages,
            };
        } catch (error: any) {
            throw new Error(`Error searching chats: ${error.message}`);
        }
    }

    async createNewChat({ adminId, companyId }: { adminId: Types.ObjectId, companyId: string }) {
        try {
            const newChat = await Chat.create({
                adminId,
                company: companyId,
                title: 'New Chat', // Optional, since default is 'New Chat'
                messages: [],
                chatType: 'general',
                status: 'active',
            });

            return newChat;
        } catch (error) {
            console.error('Error creating new chat:', error);
            throw error;
        }
    };
}