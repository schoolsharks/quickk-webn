import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import ResourcesService from '../services/resources.service';

const resourcesService = new ResourcesService();

export const fetchAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resources = await resourcesService.getAllResources();

    res.status(StatusCodes.OK).json({
      success: true,
      data: resources
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in fetchAllResources controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const fetchResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { resourceId } = req.params;
    
    if (!resourceId) {
      return next(
        new AppError('Resource ID is required', StatusCodes.BAD_REQUEST)
      );
    }

    const resource = await resourcesService.getResourceById(resourceId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: resource
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in fetchResourceById controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};