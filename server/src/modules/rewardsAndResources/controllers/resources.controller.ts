import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../../utils/appError";
import ResourcesService from "../services/resources.service";
import Admin from "../../admin/model/admin.model";
import { resourceReviewTrigger } from "../../../services/emails/triggers/admin/resourceReviewTrigger";

const resourcesService = new ResourcesService();

export const fetchAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const resources = await resourcesService.getAllResources(userId);
    res.status(StatusCodes.OK).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in fetchAllResources controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
        new AppError("Resource ID is required", StatusCodes.BAD_REQUEST)
      );
    }

    const resource = await resourcesService.getResourceById(resourceId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in fetchResourceById controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
      message: "Resources stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in getResourcesStats controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
      search: typeof search === "string" ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };

    const result = await resourcesService.searchResources(searchParams);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Resources retrieved successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in searchResources controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
      const imageFile = files.find((file) => file.fieldname === "image");
      const companyLogoFile = files.find(
        (file) => file.fieldname === "companyLogo"
      );

      if (imageFile) {
        resourceData.image = imageFile.location; // S3 URL
      }

      if (companyLogoFile) {
        resourceData.companyLogo = companyLogoFile.location; // S3 URL
      }
    }

    // Parse JSON fields if they exist
    if (
      resourceData.targetAudience &&
      typeof resourceData.targetAudience === "string"
    ) {
      resourceData.targetAudience = JSON.parse(resourceData.targetAudience);
    }
    if (
      resourceData.description &&
      typeof resourceData.description === "string"
    ) {
      resourceData.description = JSON.parse(resourceData.description);
    }

    const resource = await resourcesService.createResource(resourceData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Resource created successfully",
      data: resource,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in createResource controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
    const userRole = (req as any).user?.role; // Get user role
    const userId = req.user?.id; // Get user ID
    const companyId = req.user?.companyId; // Get company ID

    if (!resourceId) {
      return next(
        new AppError("Resource ID is required", StatusCodes.BAD_REQUEST)
      );
    }

    // Process uploaded files
    const files = req.files as Express.MulterS3.File[];
    const resourceData = { ...req.body };

    // Handle file uploads
    if (files && files.length > 0) {
      const imageFile = files.find((file) => file.fieldname === "image");
      const companyLogoFile = files.find(
        (file) => file.fieldname === "companyLogo"
      );

      if (imageFile) {
        resourceData.image = imageFile.location; // S3 URL
      }

      if (companyLogoFile) {
        resourceData.companyLogo = companyLogoFile.location; // S3 URL
      }
    }

    // Parse JSON fields if they exist
    if (
      resourceData.targetAudience &&
      typeof resourceData.targetAudience === "string"
    ) {
      resourceData.targetAudience = JSON.parse(resourceData.targetAudience);
    }
    if (
      resourceData.description &&
      typeof resourceData.description === "string"
    ) {
      resourceData.description = JSON.parse(resourceData.description);
    }

    // Role-based status logic: Admin sends for review, Super Admin publishes
    let finalStatus = resourceData.status;

    if (resourceData.status === 'ACTIVE') {
      if (userRole === "ADMIN") {
        // Admin wants to publish, change to pending-review
        finalStatus = 'PENDING_REVIEW';
        console.log('Admin attempted to publish resource, changing status to PENDING_REVIEW');
      } else if (userRole === 'SUPER-ADMIN') {
        // Super Admin can publish directly
        finalStatus = 'ACTIVE';
        console.log('Super Admin publishing resource');
      }
    }

    resourceData.status = finalStatus;

    const resource = await resourcesService.updateResource(
      resourceId,
      resourceData
    );

    console.log('Resource updated with status:', finalStatus);
    // Send email notification to Super Admins if status is pending-review
    if (finalStatus === 'PENDING_REVIEW') {
      try {
        const superAdmins = await Admin.find({
          company: companyId,
          role: 'super-admin'
        }).select('email name');

        if (superAdmins && superAdmins.length > 0) {
          const adminEmails = superAdmins.map((admin: any) => admin.email);
          const submittedByAdmin = await Admin.findById(userId);
          const submittedBy = submittedByAdmin?.name || 'Admin';

          await resourceReviewTrigger({
            adminEmails,
            resourceTitle: resource.heading || "Untitled Resource",
            resourceId: resourceId.toString(),
            submittedBy,
          });
        }
      } catch (emailError) {
        console.error('Error sending resource review notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in updateResource controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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
        new AppError("Resource ID is required", StatusCodes.BAD_REQUEST)
      );
    }

    await resourcesService.deleteResource(resourceId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in deleteResource controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
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

    if (!search || typeof search !== "string") {
      return next(
        new AppError("Search term is required", StatusCodes.BAD_REQUEST)
      );
    }

    const companies = await resourcesService.searchCompanies(search);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error("Error in searchCompanies controller:", error);
    return next(
      new AppError("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
