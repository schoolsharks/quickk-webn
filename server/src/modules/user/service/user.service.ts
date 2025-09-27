import User from "../model/user.model";
import Company from "../../company/model/company.model";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import Avatar from "../model/user.avatar.model";
import { generateTodayDate } from "../../../utils/generateTodayDate";
import { IUser } from "../types/interfaces";
import QuestionResponse from "../../questions/model/question.response";
import UserModule from "../../learning/model/user.module.model";
import { EventRegistration } from "../../events/models/events.model";
import DailyPulse from "../../dailyPulse/model/dailyPulse.model";
import UserRewardsClaims from "../../rewardsAndResources/models/userRewardClaims";
import { RewardTypes } from "../../rewardsAndResources/types/enums";

class UserService {
  private readonly ADVERTISEMENT_REWARD_TYPE = RewardTypes.ADVERTISEMENT;
  private readonly ADVERTISEMENT_STARS_THRESHOLD = 1000;
  async getUserByIdWithCompany(userId: mongoose.Types.ObjectId) {
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    ]).then((results) => results[0]);

    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return user;
  }

  async registerUserWithCompanyCheck({
    companyMail,
    name,
    companyId,
  }: {
    companyMail: string;
    name: string;
    companyId: string;
  }) {
    const existingUser = await User.findOne({ companyMail });
    if (existingUser) {
      throw new AppError("User already exists", StatusCodes.CONFLICT);
    }
    const company = await Company.findOne({ companyId });
    if (!company) {
      throw new AppError("Company not found", StatusCodes.NOT_FOUND);
    }

    const newUser = await User.create({
      name,
      companyMail,
      company: company._id,
    });

    return newUser;
  }

  async awardStars(userId: Types.ObjectId, starsToAdd: number) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");
      user.totalStars += starsToAdd;
      await user.save();
      return starsToAdd;
    } catch (error) {
      throw new AppError(
        "Stars Not awarded for this question.",
        StatusCodes.NOT_FOUND
      );
    }
  }

  async deductStars(
    userId: Types.ObjectId,
    starsToDeduct: number,
    session: mongoose.ClientSession
  ) {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    if (user.totalStars < starsToDeduct) {
      throw new AppError("Insufficient stars", StatusCodes.BAD_REQUEST);
    }
    user.totalStars -= starsToDeduct;
    user.redeemedStars += starsToDeduct; // Increment redeemed stars
    await user.save({ session });
    return user.totalStars;
  }

  async getAllUsersWithDetails(companyId: string) {
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const users = await User.aggregate([
      {
        $match: {
          company: new Types.ObjectId(companyId),
        },
      },
      {
        $lookup: {
          from: "avatars", // Assuming the referenced model is stored in the 'avatars' collection
          localField: "avatar",
          foreignField: "_id",
          as: "avatarDetails",
        },
      },
      {
        $project: {
          name: 1,
          totalStars: 1,
          time: 1,
          avatar: { $arrayElemAt: ["$avatarDetails.src", 0] },
          businessLogo: 1,
        },
      },
    ]);
    // users.splice(20);

    return {
      users,
      currentMonth,
      currentYear,
    };
  }

  async getUserRankByStars(userId: Types.ObjectId) {
    // Get all users sorted by totalStars descending
    const users = await User.find({}, { _id: 1, totalStars: 1 })
      .sort({ totalStars: -1, _id: 1 })
      .lean();

    // Find the index of the user
    const rank = users.findIndex(
      (user) => user._id.toString() === userId.toString()
    );
    if (rank === -1) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    // Rank is index + 1 (since index is 0-based)
    return { rank: rank + 1 };
  }

  async getAllAvatars() {
    const avatars = await Avatar.find({}, { src: 1, id: 1 }).lean();
    return avatars;
  }

  async selectAvatar(userId: Types.ObjectId, avatarId: Types.ObjectId) {
    const avatar = await Avatar.findById(avatarId);
    if (!avatar) {
      throw new AppError("Avatar not found", StatusCodes.NOT_FOUND);
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatar._id, avatarSelected: true },
      { new: true }
    );
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    return user;
  }

  async updateLearningStreak(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const now = generateTodayDate(); // e.g., returns today's date at midnight
    const lastActivity = user.lastLearningActivity;

    // If last activity was today, do nothing
    if (lastActivity && lastActivity.toDateString() === now.toDateString()) {
      return user.learningStreak;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (
      lastActivity &&
      lastActivity.toDateString() === yesterday.toDateString()
    ) {
      // If last activity was yesterday, increment streak
      user.learningStreak += 1;
    } else {
      // Otherwise, reset streak
      user.learningStreak = 1;
    }

    user.lastLearningActivity = now;
    await user.save();
    console.log("Updated learning streak:", user.learningStreak);

    return user.learningStreak;
  }

  async getAllUsers(companyId: string): Promise<IUser[]> {
    try {
      const users = await User.find({ company: companyId });
      return users;
    } catch (error) {
      throw new AppError(
        "Error fetching all users.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async AddEditUser(userData: any) {
    try {
      // Validate required fields
      if (!userData.companyMail) {
        return {
          success: false,
          message: "Company email is required",
        };
      }

      if (!userData.userId) {
        return {
          success: false,
          message: "UserId is required",
        };
      }

      if (!userData.name) {
        return {
          success: false,
          message: "Name is required",
        };
      }

      // Validate contact format if provided
      if (userData.contact && !/^\d{10}$/.test(userData.contact)) {
        return {
          success: false,
          message: "Contact number must be exactly 10 digits",
        };
      }

      // Update existing user
      const updatedUser = await User.findByIdAndUpdate(
        userData.userId,
        {
          $set: {
            companyMail: userData.companyMail,
            name: userData.name,
            address: userData.address,
            contact: userData.contact,
            chapter: userData.chapter,
            businessName: userData.businessName,
            businessLogo: userData.businessLogo,
            instagram: userData.instagram,
            facebook: userData.facebook,
            businessCategory: userData.businessCategory,
            specialisation: userData.specialisation,
            designation: userData.designation || "",
            currentStage: userData.currentStage || "",
            communityGoal: userData.communityGoal || "",
            interestedEvents: userData.interestedEvents || "",
          },
        },
        { new: true, runValidators: true }
      );

      return {
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      };
    } catch (error: any) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return {
          success: false,
          message: `Validation error: ${validationErrors.join(", ")}`,
          error: error,
        };
      }

      // Handle duplicate key error
      if (error.code === 11000) {
        return {
          success: false,
          message: "User with this company email already exists",
          error: error,
        };
      }

      // Other errors
      return {
        success: false,
        message: "Failed to create or update user",
        error: error,
      };
    }
  }

  async getUserById(userId: mongoose.Types.ObjectId) {
    try {
      const user = await User.findById(userId);
      // console.log(user);
      return user;
    } catch (error) {
      throw new AppError(
        "Error fetching user.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createBlankUser(
    companyId: string
  ): Promise<{ _id: mongoose.Types.ObjectId }> {
    try {
      const user = new User({
        name: "New User",
        companyMail: `UNDEFINED_${Date.now()}`,
        contact: "",
        address: "",
        company: new Types.ObjectId(companyId),
      });

      const savedUser = await user.save();

      return savedUser._id;
    } catch (error) {
      console.log("error at creating blank user : ", error);
      throw new AppError(
        "Failed to create blank user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
      }
    } catch (error) {
      throw new AppError(
        "Error deleting user.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async bulkCreateUsers(users: any[], companyId: string) {
    try {
      const results = {
        success: true,
        totalRows: users.length,
        successfullyCreated: 0,
        errors: [] as any[],
        duplicates: [] as any[],
      };

      // Get company ObjectId
      const company = await Company.findById(companyId);
      if (!company) {
        return {
          success: false,
          message: "Company not found",
        };
      }

      // Process each user
      for (let i = 0; i < users.length; i++) {
        const userData = users[i];
        const rowNumber = i + 1;

        try {
          // Validate required fields
          if (!userData.name || !userData.companyMail) {
            results.errors.push({
              row: rowNumber,
              data: userData,
              error: "Name and Company Email are required",
            });
            continue;
          }

          // Validate email format
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(userData.companyMail)) {
            results.errors.push({
              row: rowNumber,
              data: userData,
              error: "Invalid email format",
            });
            continue;
          }

          // Validate contact if provided
          if (userData.contact && !/^\d{10}$/.test(userData.contact)) {
            results.errors.push({
              row: rowNumber,
              data: userData,
              error: "Contact number must be exactly 10 digits",
            });
            continue;
          }

          // Check if user already exists
          const existingUser = await User.findOne({
            companyMail: userData.companyMail,
            company: company._id,
          });

          if (existingUser) {
            results.duplicates.push({
              row: rowNumber,
              data: userData,
              existingUser: {
                _id: existingUser._id,
                name: existingUser.name,
                companyMail: existingUser.companyMail,
              },
            });
            continue;
          }

          // Create new user
          const newUser = new User({
            name: userData.name.trim(),
            companyMail: userData.companyMail.trim().toLowerCase(),
            contact: userData.contact?.trim() || "",
            address: userData.address?.trim() || "",
            chapter: userData.chapter?.trim() || "",
            businessName: userData.businessName?.trim() || "",
            instagram: userData.instagram?.trim() || "",
            facebook: userData.facebook?.trim() || "",
            businessCategory: userData.businessCategory?.trim() || "",
            specialisation: userData.specialisation?.trim() || "",
            webnClubMember: userData.webnClubMember || false,
            company: company._id,
            learningStreak: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await newUser.save();
          results.successfullyCreated++;
        } catch (error: any) {
          results.errors.push({
            row: rowNumber,
            data: userData,
            error: error.message || "Failed to create user",
          });
        }
      }

      // Set overall success based on whether we had any successful creations
      results.success = results.successfullyCreated > 0;

      return results;

    } catch (error: any) {
      console.error("Error in bulk user creation:", error);
      return {
        success: false,
        message: error.message || "Failed to process bulk upload"
      };
    }
  }

  async getReferralStats(companyId: string) {
    try {
      const companyObjectId = new Types.ObjectId(companyId);

      const [totalReferrals, signedUp, advertised] = await Promise.all([
        User.countDocuments({
          company: companyObjectId,
          referredBy: { $ne: null },
        }),
        User.countDocuments({
          company: companyObjectId,
          webnClubMember: false,
        }),
        this.countAdvertisedClaims(companyObjectId),
      ]);

      return {
        totalReferrals,
        signedUp,
        converted: 0,
        advertised,
      };
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      throw new AppError(
        "Failed to fetch referral stats",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getReferralUsers({
    companyId,
    search,
    page = 1,
    limit = 20,
    sortBy = "mostStars",
  }: {
    companyId: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    try {
      const companyObjectId = new Types.ObjectId(companyId);
      const advertisementType = this.ADVERTISEMENT_REWARD_TYPE;
      const safePage = Math.max(Number(page) || 1, 1);
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const skip = (safePage - 1) * safeLimit;

      const pipeline: mongoose.PipelineStage[] = [
        { $match: { company: companyObjectId } },
        {
          $lookup: {
            from: "userrewardsclaims",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user", "$$userId"] },
                      { $eq: ["$rewardType", advertisementType] },
                    ],
                  },
                },
              },
            ],
            as: "advertisementClaims",
          },
        },
        {
          $addFields: {
            advertisementClaim: { $arrayElemAt: ["$advertisementClaims", 0] },
            hasAdvertisementClaim: {
              $gt: [{ $size: "$advertisementClaims" }, 0],
            },
          },
        },
        {
          $addFields: {
            advertisementClaimId: "$advertisementClaim._id",
            advertised: {
              $cond: [
                { $ifNull: ["$advertisementClaim.advertised", false] },
                true,
                false,
              ],
            },
            hasValidAdvertisementClaim: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $size: "$advertisementClaims" }, 0] },
                    {
                      $ne: ["$advertisementClaim.advertised", true],
                    },
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            $or: [
              { hasValidAdvertisementClaim: true },
              {
                $and: [
                  { totalStars: { $gte: this.ADVERTISEMENT_STARS_THRESHOLD } },
                  { hasAdvertisementClaim: false },
                ],
              },
            ],
          },
        },
      ];

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: regex } },
              { companyMail: { $regex: regex } },
              { contact: { $regex: regex } },
            ],
          },
        });
      }

      pipeline.push({
        $addFields: {
          hasValidAdvertisementClaimNumeric: {
            $cond: ["$hasValidAdvertisementClaim", 1, 0],
          },
        },
      });

      let sortCriteria: Record<string, 1 | -1> = {
        hasValidAdvertisementClaimNumeric: -1,
        totalStars: -1,
        updatedAt: -1,
      };

      switch (sortBy) {
        case "mostStars":
          sortCriteria = { totalStars: -1, updatedAt: -1 };
          break;
        case "leastStars":
          sortCriteria = { totalStars: 1, updatedAt: -1 };
          break;
        case "recent":
          sortCriteria = { updatedAt: -1 };
          break;
        case "hasClaim":
          sortCriteria = {
            hasValidAdvertisementClaimNumeric: -1,
            totalStars: -1,
            updatedAt: -1,
          };
          break;
        default:
          break;
      }

      pipeline.push({ $sort: sortCriteria });

      pipeline.push({
        $project: {
          advertisementClaims: 0,
          advertisementClaim: 0,
        },
      });

      pipeline.push({
        $facet: {
          data: [
            { $skip: skip },
            { $limit: safeLimit },
          ],
          totalCount: [{ $count: "count" }],
        },
      });

      const result = await User.aggregate(pipeline);
      const facetData = result[0] ?? { data: [], totalCount: [] };
      const users = (facetData.data as Record<string, any>[]) ?? [];
      const total = facetData.totalCount?.[0]?.count ?? 0;
      const totalPages =
        safeLimit > 0 ? Math.max(Math.ceil(total / safeLimit), 1) : 1;

      const formattedUsers = users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        companyMail: user.companyMail,
        contact: user.contact,
        totalStars: user.totalStars ?? 0,
        webnClubMember: Boolean(user.webnClubMember),
        hasAdvertisementClaim: Boolean(user.hasAdvertisementClaim),
        advertisementClaimId: user.advertisementClaimId
          ? user.advertisementClaimId.toString()
          : undefined,
        advertised: Boolean(user.advertised),
        lastUpdated: user.updatedAt
          ? new Date(user.updatedAt).toISOString()
          : null,
      }));

      return {
        users: formattedUsers,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching referral users:", error);
      throw new AppError(
        "Failed to fetch referral users",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async countAdvertisedClaims(
    companyObjectId: Types.ObjectId
  ): Promise<number> {
    const result = await UserRewardsClaims.aggregate([
      {
        $match: {
          rewardType: this.ADVERTISEMENT_REWARD_TYPE,
          advertised: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.company": companyObjectId } },
      { $count: "count" },
    ]);

    return result[0]?.count ?? 0;
  }

  async getUserRecommendations(
    userId: mongoose.Types.ObjectId,
    companyId: string,
    options: {
      page: number;
      limit: number;
      refreshToken?: string;
    }
  ) {
    try {
      const { page, limit, refreshToken } = options;

      // Get current user to understand their profile for matching
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
      }

      // Create aggregation pipeline for recommendations
      const pipeline = [
        // Exclude current user and ensure they are in same company
        {
          $match: {
            _id: { $ne: new Types.ObjectId(userId) }, // Explicitly exclude current user
            company: new Types.ObjectId(companyId),
            // Ensure user has basic profile info
            name: { $exists: true, $ne: "" },
            businessName: { $exists: true, $ne: "" },
          }
        },
        // Lookup avatar information
        {
          $lookup: {
            from: 'avatars',
            localField: 'avatar',
            foreignField: '_id',
            as: 'avatarDetails',
          }
        },
        // Add calculated match score
        {
          $addFields: {
            matchScore: {
              $add: [
                // Chapter match (40 points)
                {
                  $cond: {
                    if: { $eq: ["$chapter", currentUser.chapter] },
                    then: 40,
                    else: 0
                  }
                },
                // Business category match (30 points)
                {
                  $cond: {
                    if: { $eq: ["$businessCategory", currentUser.businessCategory] },
                    then: 30,
                    else: 0
                  }
                },
                // Specialisation match (20 points)
                {
                  $cond: {
                    if: { $eq: ["$specialisation", currentUser.specialisation] },
                    then: 20,
                    else: 0
                  }
                },
                // Same company base points (10 points)
                10
              ]
            },
            // Add randomization factor for shuffling
            randomFactor: {
              $multiply: [
                { $rand: {} },
                refreshToken ? 1 : 10 // Less randomness on pagination
              ]
            }
          }
        },
        // Sort by match score and randomization
        {
          $sort: {
            matchScore: -1 as const,
            randomFactor: -1 as const,
            _id: 1 as const // For consistent pagination
          }
        },
        // Project required fields
        {
          $project: {
            _id: 1,
            name: 1,
            businessName: 1,
            businessLogo: 1,
            businessCategory: 1,
            specialisation: 1,
            chapter: 1,
            instagram: 1,
            facebook: 1,
            companyMail: 1,
            avatar: { $arrayElemAt: ['$avatarDetails.src', 0] },
            matchScore: 1
          }
        }
      ];

      // Get total count for pagination
      const totalCountPipeline = [
        {
          $match: {
            _id: { $ne: new Types.ObjectId(userId) }, // Explicitly exclude current user
            company: new Types.ObjectId(companyId),
            name: { $exists: true, $ne: "" },
            businessName: { $exists: true, $ne: "" },
          }
        },
        { $count: "total" }
      ];

      const [recommendations, totalCountResult] = await Promise.all([
        User.aggregate([
          ...pipeline,
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ]),
        User.aggregate(totalCountPipeline)
      ]);

      const total = totalCountResult[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      return {
        recommendations,
        pagination: {
          currentPage: page,
          totalPages,
          hasMore,
          total,
          limit
        },
        meta: {
          algorithm: 'weighted_matching_v1',
          refreshToken: refreshToken || `${Date.now()}_${userId}`,
          matchingCriteria: {
            chapter: currentUser.chapter,
            businessCategory: currentUser.businessCategory,
            specialisation: currentUser.specialisation
          }
        }
      };

    } catch (error) {
      console.error('Error getting user recommendations:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get recommendations', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getEngagementAnalytics(companyId: string) {
    try {
      const currentYear = new Date().getFullYear();
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      // Get all users for the company
      const users = await User.find({ company: companyId }).lean();

      // Import required models
      // const QuestionResponse = (await import('../../questions/model/question.response')).default;
      // const UserModule = (await import('../../learning/model/user.module.model')).default;
      // const { EventRegistration } = (await import('../../events/models/events.model'));

      const analyticsData = await Promise.all(
        months.map(async (month, index) => {
          const monthStart = new Date(currentYear, index, 1);
          const monthEnd = new Date(currentYear, index + 1, 0, 23, 59, 59, 999);

          // Get users who had any activity in this month
          const activeUserIds = new Set<string>();

          // 1. Daily Pulse Engagement - users who responded to questions
          const dailyPulseResponses = await QuestionResponse.find({
            createdAt: { $gte: monthStart, $lte: monthEnd }
          }).distinct('user');
          dailyPulseResponses.forEach((userId) => activeUserIds.add(userId.toString()));

          // 2. Learning Activity - users who completed modules or had learning activity
          const learningActivities = await UserModule.find({
            $or: [
              { createdAt: { $gte: monthStart, $lte: monthEnd } },
              { completedAt: { $gte: monthStart, $lte: monthEnd } }
            ]
          }).distinct('user');
          learningActivities.forEach((userId) => activeUserIds.add(userId.toString()));

          // 3. Event Participation - users who registered for events
          if (EventRegistration) {
            try {
              const eventParticipations = await EventRegistration.find({
                createdAt: { $gte: monthStart, $lte: monthEnd }
              }).distinct('user');
              eventParticipations.forEach((userId: any) => activeUserIds.add(userId.toString()));
            } catch (error) {
              console.log('Error fetching event registrations:', error);
            }
          }

          // 4. General Activity - users with lastLearningActivity in this month
          const generalActivity = users.filter(user => {
            if (user.lastLearningActivity) {
              const activityDate = new Date(user.lastLearningActivity);
              return activityDate >= monthStart && activityDate <= monthEnd;
            }
            return false;
          });
          generalActivity.forEach(user => activeUserIds.add(user._id.toString()));

          // 5. Users created in this month (new registrations)
          const newUsers = users.filter((user: any) => {
            if (user.createdAt) {
              const createdDate = new Date(user.createdAt);
              return createdDate >= monthStart && createdDate <= monthEnd;
            }
            return false;
          });
          newUsers.forEach(user => activeUserIds.add(user._id.toString()));

          // Filter active users by webnClubMember status
          const activeUsers = users.filter(user => activeUserIds.has(user._id.toString()));

          const gowomaniaCount = activeUsers.filter(user => !user.webnClubMember).length;
          const webnCount = activeUsers.filter(user => user.webnClubMember === true).length;

          return {
            month,
            gowomania: gowomaniaCount,
            webn: webnCount
          };
        })
      );

      return analyticsData;
    } catch (error) {
      console.error('Error getting engagement analytics:', error);
      throw new AppError('Failed to get engagement analytics', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getParticipationLeaderboard(companyId: string) {
    try {
      // Get date range for last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      // Get all users for the company
      const users = await User.find({ company: companyId })
        .select('_id name businessLogo businessName')
        .lean();

      if (!users.length) {
        return [];
      }

      // Get published daily pulses from last 7 days
      const dailyPulses = await DailyPulse.find({
        company: companyId,
        publishOn: { $gte: sevenDaysAgo, $lte: today },
      }).select('pulses').lean();

      // Extract all question IDs from daily pulses
      const questionIds = dailyPulses.flatMap(pulse =>
        pulse.pulses.map(p => p.refId)
      );


      if (questionIds.length === 0) {
        // No daily pulses in last 7 days, return users with 0% participation
        return users.slice(0, 6).map((user, index) => ({
          id: user._id.toString(),
          rank: index + 1,
          name: user.name,
          businessLogo: user.businessLogo,
          businessName: user.businessName,
          percentage: 0
        }));
      }

      // Get user responses to these questions in last 7 days
      const responses = await QuestionResponse.find({
        question: { $in: questionIds },
      }).select('user question').lean();

      // Calculate participation percentage for each user
      const userParticipation = users.map(user => {
        const userResponses = responses.filter(
          response => response.user.toString() === user._id.toString()
        );

        // Calculate unique questions answered by user
        const uniqueQuestionsAnswered = new Set(
          userResponses.map(r => r.question.toString())
        ).size;

        const percentage = questionIds.length > 0
          ? Math.round((uniqueQuestionsAnswered / questionIds.length) * 100)
          : 0;

        return {
          id: user._id.toString(),
          name: user.name,
          businessLogo: user.businessLogo,
          businessName: user.businessName,
          percentage
        };
      });

      // Sort by percentage (descending) and assign ranks
      const sortedUsers = userParticipation
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6) // Top 10 users
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));

      return sortedUsers;
    } catch (error) {
      console.error('Error getting participation leaderboard:', error);
      throw new AppError('Failed to get participation leaderboard', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

}

export default UserService;
