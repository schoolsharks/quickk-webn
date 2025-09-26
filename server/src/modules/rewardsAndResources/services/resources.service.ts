import { Resources } from '../models/resources';
import { IResources } from '../types/interface';
import mongoose from 'mongoose';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';

class ResourcesService {
  async getAllResources(): Promise<IResources[]> {
    return await Resources.find();
  }

  async getResourceById(resourceId: string): Promise<IResources> {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new AppError('Invalid resource ID format', StatusCodes.BAD_REQUEST);
    }

    const resource = await Resources.findById(resourceId);
    
    if (!resource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    return resource;
  }
}

export default ResourcesService;