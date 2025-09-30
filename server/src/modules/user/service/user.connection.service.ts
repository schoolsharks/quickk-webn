import mongoose, { ObjectId, Types } from "mongoose";
import { UserConnection } from "../model/user.connection.model";
import User from "../model/user.model";
import { ConnectionPlatform, ConnectionStatus, IUserConnection } from "../types/interfaces";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import UserConnectionFeedbackService from "./user.connection.feedback.service";

class UserConnectionService {
    private userConnectionFeedbackService = new UserConnectionFeedbackService();

    async addConnection(userId: string, connectionId: string, platform: ConnectionPlatform): Promise<IUserConnection> {
        // Validate user IDs
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(connectionId)) {
            throw new AppError("Invalid user ID format", StatusCodes.BAD_REQUEST);
        }

        // Prevent self-connection
        if (userId === connectionId) {
            throw new AppError("Cannot connect with yourself", StatusCodes.BAD_REQUEST);
        }

        // Check if both users exist
        const [user, connectionUser] = await Promise.all([
            User.findById(userId),
            User.findById(connectionId)
        ]);

        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        if (!connectionUser) {
            throw new AppError("Connection user not found", StatusCodes.NOT_FOUND);
        }

        // Validate platform
        if (!Object.values(ConnectionPlatform).includes(platform)) {
            throw new AppError("Invalid platform", StatusCodes.BAD_REQUEST);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const connectionObjectId = new mongoose.Types.ObjectId(connectionId);

        try {
            // Try to find existing connection
            const existingConnection = await UserConnection.findOne({
                userId: userObjectId,
                connectionId: connectionObjectId
            });

            if (existingConnection) {
                // Check if platform already exists
                if (existingConnection.platforms.includes(platform)) {
                    return existingConnection;
                }

                // Add new platform to existing connection
                existingConnection.platforms.push(platform);
                await existingConnection.save();

                // Create feedback entry for new platform connection
                try {
                    await this.userConnectionFeedbackService.createConnectionFeedback(
                        userId,
                        existingConnection._id.toString()
                    );
                } catch (error) {
                    // Log error but don't fail the connection process
                    console.error('Error creating connection feedback:', error);
                }

                return existingConnection;
            }

            // Create new connection
            const newConnection = new UserConnection({
                userId: userObjectId,
                connectionId: connectionObjectId,
                platforms: [platform]
            });

            await newConnection.save();

            // Create feedback entry for new connection
            try {
                await this.userConnectionFeedbackService.createConnectionFeedback(
                    userId,
                    newConnection._id.toString()
                );
            } catch (error) {
                // Log error but don't fail the connection process
                console.error('Error creating connection feedback:', error);
            }

            return newConnection;

        } catch (error: any) {
            if (error.code === 11000) {
                // Handle duplicate key error (race condition)
                return this.addConnection(userId, connectionId, platform);
            }
            throw error;
        }
    }

    async getUserConnections(userId: string, page: number = 1, limit: number = 10) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid user ID format", StatusCodes.BAD_REQUEST);
        }

        const skip = (page - 1) * limit;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const [connections, totalCount] = await Promise.all([
            UserConnection.find({ userId: userObjectId })
                .populate('connectionId', 'name businessName designation businessLogo businessCategory webnClubMember')
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            UserConnection.countDocuments({ userId: userObjectId })
        ]);

        return {
            connections,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNext: page * limit < totalCount,
                hasPrev: page > 1
            }
        };
    }

    async getConnectionStats(userId: string) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid user ID format", StatusCodes.BAD_REQUEST);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const stats = await UserConnection.aggregate([
            { $match: { userId: userObjectId } },
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: "$platforms",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalConnections: { $sum: "$count" },
                    platformStats: {
                        $push: {
                            platform: "$_id",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || { totalConnections: 0, platformStats: [] };

        // Ensure all platforms are represented
        const allPlatforms = Object.values(ConnectionPlatform);
        const platformMap = new Map(result.platformStats.map((stat: any) => [stat.platform, stat.count]));

        const completeStats = allPlatforms.map(platform => ({
            platform,
            count: platformMap.get(platform) || 0
        }));

        return {
            totalConnections: result.totalConnections,
            platformStats: completeStats
        };
    }

    async checkConnectionExists(userId: string, connectionId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(connectionId)) {
            return false;
        }

        const connection = await UserConnection.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            connectionId: new mongoose.Types.ObjectId(connectionId)
        });

        return !!connection;
    }

    // Helper method to get date range based on period
    private getDateRange(period?: string) {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        switch (period) {
            case "current":
                return { startDate: currentMonth, endDate: now };
            case "3months":
                return {
                    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
                    endDate: now
                };
            case "6months":
                return {
                    startDate: new Date(now.getFullYear(), now.getMonth() - 5, 1),
                    endDate: now
                };
            default:
                return { startDate: currentMonth, endDate: now };
        }
    }

    // Admin Methods
    async getCompanyConnectionStats(companyId: string, period?: string) {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            throw new AppError("Invalid company ID format", StatusCodes.BAD_REQUEST);
        }

        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        const { startDate, endDate } = this.getDateRange(period);

        // Get total connections and platform breakdown with date filtering
        const stats = await UserConnection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: {
                    "user.company": companyObjectId,
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    status: { $ne: ConnectionStatus.REJECTED }
                }
            },
            {
                $unwind: "$platforms"
            },
            {
                $group: {
                    _id: "$platforms",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalConnections: { $sum: "$count" },
                    platformStats: {
                        $push: {
                            platform: "$_id",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || { totalConnections: 0, platformStats: [] };

        // Ensure all platforms are represented
        const allPlatforms = Object.values(ConnectionPlatform);
        const platformMap = new Map(result.platformStats.map((stat: any) => [stat.platform, stat.count]));

        const completeStats = allPlatforms.map(platform => ({
            platform,
            count: platformMap.get(platform) || 0
        }));

        return {
            totalConnections: result.totalConnections,
            platformStats: completeStats
        };
    }

    async getConnectionsForExport(
        companyId: string,
        options: {
            page?: number;
            limit?: number;
            startDate?: Date;
            endDate?: Date;
            platform?: ConnectionPlatform;
        } = {}
    ) {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            throw new AppError("Invalid company ID format", StatusCodes.BAD_REQUEST);
        }

        const {
            page = 1,
            limit = 1000, // Default limit for performance
            startDate,
            endDate,
            platform
        } = options;

        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        const skip = (page - 1) * limit;

        // Build match conditions
        const matchConditions: any = {
            "user.company": companyObjectId
        };

        if (startDate || endDate) {
            matchConditions.createdAt = {};
            if (startDate) matchConditions.createdAt.$gte = startDate;
            if (endDate) matchConditions.createdAt.$lte = endDate;
        }

        const pipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "connectionId",
                    foreignField: "_id",
                    as: "connectedUser"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $unwind: "$connectedUser"
            },
            {
                $match: matchConditions
            },
            // Add platform filter if specified (before unwinding platforms)
            ...(platform ? [{
                $match: {
                    platforms: platform
                }
            }] : []),
            // Unwind platforms to create separate records for each platform
            {
                $unwind: "$platforms"
            }
        ];

        // Add projection and pagination
        pipeline.push(
            {
                $project: {
                    _id: 0,
                    userName: "$user.name",
                    userEmail: "$user.companyMail",
                    userBusinessName: "$user.businessName",
                    connectedUserName: "$connectedUser.name",
                    connectedUserEmail: "$connectedUser.companyMail",
                    connectedUserBusinessName: "$connectedUser.businessName",
                    platform: "$platforms", // Single platform per record after unwind
                    status: 1,
                    connectionDate: "$createdAt",
                    lastUpdated: "$updatedAt"
                }
            },
            {
                $sort: { connectionDate: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        );

        const [connections, totalCount] = await Promise.all([
            UserConnection.aggregate(pipeline),
            this.getConnectionsCount(companyId, { startDate, endDate, platform })
        ]);

        return {
            connections,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNext: page * limit < totalCount,
                hasPrev: page > 1,
                limit
            }
        };
    }

    private async getConnectionsCount(
        companyId: string,
        filters: {
            startDate?: Date;
            endDate?: Date;
            platform?: ConnectionPlatform;
        } = {}
    ): Promise<number> {
        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        const { startDate, endDate, platform } = filters;

        const matchConditions: any = {
            "user.company": companyObjectId
        };

        if (startDate || endDate) {
            matchConditions.createdAt = {};
            if (startDate) matchConditions.createdAt.$gte = startDate;
            if (endDate) matchConditions.createdAt.$lte = endDate;
        }

        const pipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $match: matchConditions
            }
        ];

        // Add platform filter if specified (before unwinding)
        if (platform) {
            pipeline.push({
                $match: {
                    platforms: platform
                }
            });
        }

        // Unwind platforms to count individual platform connections
        pipeline.push(
            {
                $unwind: "$platforms"
            },
            {
                $count: "total"
            }
        );

        const result = await UserConnection.aggregate(pipeline);
        return result[0]?.total || 0;
    }

    async getTotalConnectionCount(userId: Types.ObjectId): Promise<number> {

        // Count the number of UserConnection documents for the user
        const count = await UserConnection.countDocuments({ userId: userId, status: { $ne: ConnectionStatus.REJECTED } });
        return count;
    }
}

export default UserConnectionService;