import { Request, Response, NextFunction } from 'express';
import LearningService from '../services/learning.service';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import { SearchHelper } from '../../../utils/search/searchHelper';
import { searchConfigs } from '../../../utils/search/searchConfigs';

const learningService = new LearningService();

// Controller to get learning by week
export const getLearningByWeek = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        let { week } = req.body;
        const companyId = req.user?.companyId;
        week = "2";  //hardcoded need to change according to the client
        if (isNaN(Number(week))) {
            return next(new AppError('Invalid week parameter', StatusCodes.BAD_REQUEST));
        }

        const learning = await learningService.getLearningByWeek(Number(week), userId, companyId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: learning,
        });
    } catch (error) {
        console.error('Error in getLearningByWeek:', error);
        next(new AppError('An unexpected error occurred while fetching learning data', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getTotalLearningTimeForAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const totalTime = await learningService.getTotalLearningTimeForAllUsers(companyId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: { totalTime: totalTime },
        });
    } catch (error) {
        console.error('Error in getTotalLearningTimeForAllUsers:', error);
        next(new AppError('An unexpected error occurred while fetching total learning time', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const getLearningTableData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const tableData = await learningService.getLearningTableData(companyId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: tableData,
        });
    } catch (error) {
        console.error('Error in getLearningTableData:', error);
        next(new AppError('An unexpected error occurred while fetching learning table data', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const updateLearningWithModules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { learningId, title, moduleIds, validTill, publishOn, status } = req.body;

        const learning = await learningService.updateLearningWithModules({
            learningId,
            title,
            moduleIds,
            validTill,
            publishOn,
            status
        });

        res.status(StatusCodes.CREATED).json({
            status: 'success',
            data: learning,
        });
    } catch (error) {
        console.error('Error in createLearningWithModules:', error);
        next(new AppError('Failed to create learning', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const publishLearningIfAllModulesCompleted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { learningId } = req.params;
        if (!learningId) {
            return next(new AppError('learningId is required', StatusCodes.BAD_REQUEST));
        }

        const updatedLearning = await learningService.publishLearningIfAllModulesCompleted(learningId);

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: updatedLearning,
        });
    } catch (error) {
        console.error('Error in publishLearningIfAllModulesCompleted:', error);
        next(error);
    }
};

export const createBlankLearning = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const companyId = req.user?.companyId;
        const result = await learningService.createBlankLearning(companyId);
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        console.error('Error in createBlankLearning:', error);
        next(new AppError('Failed to create blank learning', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getLearningById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { learningId } = req.params;
        if (!learningId) {
            return next(new AppError('learningId is required', StatusCodes.BAD_REQUEST));
        }

        const learning = await learningService.getLearningById(learningId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: learning,
        });
    } catch (error) {
        console.error('Error in getLearningById:', error);
        next(error);
    }
};

export const deleteLearningById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { learningId } = req.body;
        if (!learningId) {
            return next(new AppError('learningId is required', StatusCodes.BAD_REQUEST));
        }

        const result = await learningService.deleteLearningById(learningId);
        res.status(StatusCodes.OK).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        console.error('Error in deleteLearningById:', error);
        next(error);
    }
};

export const getLearningStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
                case 'published':
                    stats.published += 1;
                    break;
                case 'drafts':
                    stats.drafts += 1;
                    break;
                case 'archived':
                    stats.archived += 1;
                    break;
                default:
                    break;
            }
        });

        res.status(StatusCodes.OK).json({
            status: 'success',
            data: stats,
        });
    } catch (error) {
        console.error('Error in getLearningStats:', error);
        next(new AppError('Failed to fetch learning stats', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const getLearningTitles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companyId = req.user?.companyId;
        const allLearnings = await learningService.getAllLearnings(companyId);
        // Map to return only _id and title
        const learningTitles = allLearnings.map((learning: any) => ({
            _id: learning._id,
            title: learning.title,
        }));

        res.status(StatusCodes.OK).json({
            success: 'success',
            data: learningTitles,
        });
    } catch (error) {
        console.error('Error in getLearningTitles controller:', error);
        next(new AppError('Failed to fetch learning Titles', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};


export const archieveLearningById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { learningId } = req.params;
        const learning = await learningService.archieveLearningById(learningId);

        res.status(StatusCodes.OK).json({
            success: 'success',
            message: learning.message
        });
    } catch (error) {
        console.error('Error in archieving learning:', error);
        next(new AppError('Failed to archieve learning', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const searchLearning = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await SearchHelper.search(searchConfigs.learning, req.query, req?.user.companyId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};



