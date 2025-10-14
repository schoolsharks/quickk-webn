import { Resources } from '../models/resources';
import UserRewardsClaims from '../models/userRewardClaims';
import User from '../../user/model/user.model';
import { IResources } from '../types/interface';
import { ResourceStatus, RewardTypes, ResourceType } from '../types/enums';
import mongoose from 'mongoose';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';

interface ResourcesStats {
  total: number;
  active: number;
  drafts: number;
  totalRedeemed: number;
}

interface SearchResourcesParams {
  search?: string;
  page?: number;
  limit?: number;
}

class ResourcesService {
  async getAllResources(userId?: mongoose.Types.ObjectId): Promise<(IResources & { isClaimed?: boolean })[]> {
    const resources = await Resources.find({
      status: { $nin: [ResourceStatus.DRAFT, ResourceStatus.PENDING_REVIEW] }
    });

    // If no userId provided, return resources without isClaimed field
    if (!userId) {
      return resources;
    }

    // Add isClaimed field for each resource
    const resourcesWithClaimedStatus = await Promise.all(
      resources.map(async (resource) => {
        const claimedRecord = await UserRewardsClaims.findOne({
          user: userId,
          resourceId: resource._id,
          rewardType: RewardTypes.RESOURCES
        });

        return {
          ...resource.toObject(),
          isClaimed: !!claimedRecord
        };
      })
    );

    return resourcesWithClaimedStatus;
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

  async getResourcesStats(): Promise<ResourcesStats> {
    // Get total count
    const total = await Resources.countDocuments();

    // Get active count
    const active = await Resources.countDocuments({ status: ResourceStatus.ACTIVE });

    // Get drafts count
    const drafts = await Resources.countDocuments({ status: ResourceStatus.DRAFT });

    // Get total redeemed count from UserRewardClaims where rewardType is RESOURCES
    const totalRedeemed = await UserRewardsClaims.countDocuments({
      rewardType: RewardTypes.RESOURCES
    });

    return {
      total,
      active,
      drafts,
      totalRedeemed
    };
  }

  async searchResources(params: SearchResourcesParams): Promise<{
    resources: (IResources & { totalRedeemed: number })[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery: any = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      searchQuery = {
        $or: [
          { heading: { $regex: searchRegex } },
          { subHeading: { $regex: searchRegex } },
          { companyName: { $regex: searchRegex } }
        ]
      };
    }

    // Get total count for pagination
    const totalCount = await Resources.countDocuments(searchQuery);

    // Get resources with pagination
    const resources = await Resources.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get redeemed count for each resource
    const resourcesWithRedeemed = await Promise.all(
      resources.map(async (resource) => {
        const totalRedeemed = await UserRewardsClaims.countDocuments({
          rewardType: RewardTypes.RESOURCES,
          resourceId: resource._id
        });

        return {
          ...resource.toObject(),
          totalRedeemed
        };
      })
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      resources: resourcesWithRedeemed,
      totalCount,
      page,
      limit,
      totalPages
    };
  }

  async createResource(resourceData: Partial<IResources>): Promise<IResources> {
    const newResource = new Resources({
      heading: resourceData.heading || '',
      subHeading: resourceData.subHeading || '',
      companyName: resourceData.companyName || '',
      image: resourceData.image || '',
      type: resourceData.type || ResourceType.SERVICE,
      targetAudience: resourceData.targetAudience || ['All'],
      quantity: resourceData.quantity || 1,
      expiryDate: resourceData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      description: resourceData.description || [],
      stars: resourceData.stars || 0,
      status: ResourceStatus.DRAFT
    });

    return await newResource.save();
  }

  async updateResource(resourceId: string, resourceData: Partial<IResources>): Promise<IResources> {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new AppError('Invalid resource ID format', StatusCodes.BAD_REQUEST);
    }

    const updatedResource = await Resources.findByIdAndUpdate(
      resourceId,
      { $set: resourceData },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }

    return updatedResource;
  }

  async deleteResource(resourceId: string): Promise<void> {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new AppError('Invalid resource ID format', StatusCodes.BAD_REQUEST);
    }

    const deletedResource = await Resources.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      throw new AppError('Resource not found', StatusCodes.NOT_FOUND);
    }
  }

  async searchCompanies(searchTerm: string): Promise<{
    businessName: string;
    businessLogo: string;
    companyMail: string;
    contact: string;
  }[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const searchRegex = new RegExp(searchTerm.trim(), 'i');

    const companies = await User.find({
      businessName: { $regex: searchRegex, $exists: true, $ne: '' },
      companyMail: { $exists: true, $ne: '' }
    })
      .select('businessName businessLogo companyMail contact')
      .limit(10)
      .lean();

    return companies.map(company => ({
      businessName: company.businessName || '',
      businessLogo: company.businessLogo || '',
      companyMail: company.companyMail || '',
      contact: company.contact || ''
    }));
  }
}

export default ResourcesService;