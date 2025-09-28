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

export const getResourcesStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await resourcesService.getResourcesStats();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Resources stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in getResourcesStats controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const searchResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, page, limit } = req.query;
    
    const searchParams = {
      search: typeof search === 'string' ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10
    };

    const result = await resourcesService.searchResources(searchParams);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Resources retrieved successfully',
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in searchResources controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Process uploaded files
    const files = req.files as Express.MulterS3.File[];
    const resourceData = { ...req.body };

    // Handle file uploads
    if (files && files.length > 0) {
      const imageFile = files.find(file => file.fieldname === 'image');
      const companyLogoFile = files.find(file => file.fieldname === 'companyLogo');

      if (imageFile) {
        resourceData.image = imageFile.location; // S3 URL
      }

      if (companyLogoFile) {
        resourceData.companyLogo = companyLogoFile.location; // S3 URL
      }
    }

    // Parse JSON fields if they exist
    if (resourceData.targetAudience && typeof resourceData.targetAudience === 'string') {
      resourceData.targetAudience = JSON.parse(resourceData.targetAudience);
    }
    if (resourceData.description && typeof resourceData.description === 'string') {
      resourceData.description = JSON.parse(resourceData.description);
    }

    const resource = await resourcesService.createResource(resourceData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in createResource controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const updateResource = async (
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

    // Process uploaded files
    const files = req.files as Express.MulterS3.File[];
    const resourceData = { ...req.body };

    // Handle file uploads
    if (files && files.length > 0) {
      const imageFile = files.find(file => file.fieldname === 'image');
      const companyLogoFile = files.find(file => file.fieldname === 'companyLogo');

      if (imageFile) {
        resourceData.image = imageFile.location; // S3 URL
      }

      if (companyLogoFile) {
        resourceData.companyLogo = companyLogoFile.location; // S3 URL
      }
    }

    // Parse JSON fields if they exist
    if (resourceData.targetAudience && typeof resourceData.targetAudience === 'string') {
      resourceData.targetAudience = JSON.parse(resourceData.targetAudience);
    }
    if (resourceData.description && typeof resourceData.description === 'string') {
      resourceData.description = JSON.parse(resourceData.description);
    }

    const resource = await resourcesService.updateResource(resourceId, resourceData);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in updateResource controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const deleteResource = async (
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

    await resourcesService.deleteResource(resourceId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in deleteResource controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const searchCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search } = req.query;
    
    if (!search || typeof search !== 'string') {
      return next(
        new AppError('Search term is required', StatusCodes.BAD_REQUEST)
      );
    }

    const companies = await resourcesService.searchCompanies(search);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Companies retrieved successfully',
      data: companies
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Error in searchCompanies controller:', error);
    return next(
      new AppError(
        'Internal Server Error',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};