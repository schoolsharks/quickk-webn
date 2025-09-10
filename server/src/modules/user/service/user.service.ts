import User from '../model/user.model';
import Company from '../../company/model/company.model';
import AppError from '../../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import mongoose, { Types } from 'mongoose';
import Avatar from '../model/user.avatar.model';
import { generateTodayDate } from '../../../utils/generateTodayDate';
import { IUser } from '../types/interfaces';

class UserService {
    async getUserByIdWithCompany(userId: mongoose.Types.ObjectId) {
        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                },
            },
            { $unwind: { path: '$company', preserveNullAndEmptyArrays: true } },
        ]).then(results => results[0]);

        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }

        return user;
    }

    async registerUserWithCompanyCheck({
        companyMail,
        name,
        companyId
    }: {
        companyMail: string;
        name: string;
        companyId: string;
    }) {
        const existingUser = await User.findOne({ companyMail });
        if (existingUser) {
            throw new AppError('User already exists', StatusCodes.CONFLICT);
        }
        const company = await Company.findOne({ companyId });
        if (!company) {
            throw new AppError('Company not found', StatusCodes.NOT_FOUND);
        }

        const newUser = await User.create({ name, companyMail, company: company._id });

        return newUser;
    }

    async awardStars(userId: Types.ObjectId, starsToAdd: number) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            user.totalStars += starsToAdd;
            await user.save();
            return starsToAdd;
        } catch (error) {
            throw new AppError('Stars Not awarded for this question.', StatusCodes.NOT_FOUND);
        }

    }


    async deductStars(userId: Types.ObjectId, starsToDeduct: number, session: mongoose.ClientSession) {
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        if (user.totalStars < starsToDeduct) {
            throw new AppError('Insufficient stars', StatusCodes.BAD_REQUEST);
        }
        user.totalStars -= starsToDeduct;
        user.redeemedStars += starsToDeduct; // Increment redeemed stars
        await user.save({ session });
        return user.totalStars;
    }


    async getAllUsersWithDetails(companyId: string) {
        const currentDate = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonth = monthNames[currentDate.getMonth()];
        const currentYear = currentDate.getFullYear();

        const users = await User.aggregate([
            {
                $match: {
                    company: new Types.ObjectId(companyId)
                }
            },
            {
                $lookup: {
                    from: 'avatars', // Assuming the referenced model is stored in the 'avatars' collection
                    localField: 'avatar',
                    foreignField: '_id',
                    as: 'avatarDetails',
                },
            },
            {
                $project: {
                    name: 1,
                    totalStars: 1,
                    time: 1,
                    avatar: { $arrayElemAt: ['$avatarDetails.src', 0] },
                },
            },
        ]);

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
        const rank = users.findIndex(user => user._id.toString() === userId.toString());
        if (rank === -1) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
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
            throw new AppError('Avatar not found', StatusCodes.NOT_FOUND);
        }
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatar._id, avatarSelected: true },
            { new: true }
        );
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        return user;
    }

    async updateLearningStreak(userId: Types.ObjectId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const now = generateTodayDate(); // e.g., returns today's date at midnight
        const lastActivity = user.lastLearningActivity;

        // If last activity was today, do nothing
        if (lastActivity && lastActivity.toDateString() === now.toDateString()) {
            return user.learningStreak;
        }

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        if (lastActivity && lastActivity.toDateString() === yesterday.toDateString()) {
            // If last activity was yesterday, increment streak
            user.learningStreak += 1;
        } else {
            // Otherwise, reset streak
            user.learningStreak = 1;
        }

        user.lastLearningActivity = now;
        await user.save();
        console.log('Updated learning streak:', user.learningStreak);

        return user.learningStreak;
    }

    async getAllUsers(companyId: string): Promise<IUser[]> {
        try {
            const users = await User.find({ company: companyId });
            return users;
        } catch (error) {
            throw new AppError('Error fetching all users.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async AddEditUser(userData: any) {
        try {
            // Validate required fields
            if (!userData.companyMail) {
                return {
                    success: false,
                    message: 'Company email is required',
                };
            }

            if (!userData.userId) {
                return {
                    success: false,
                    message: 'UserId is required',
                };
            }

            if (!userData.name) {
                return {
                    success: false,
                    message: 'Name is required',
                };
            }

            // Validate contact format if provided
            if (userData.contact && !/^\d{10}$/.test(userData.contact)) {
                return {
                    success: false,
                    message: 'Contact number must be exactly 10 digits',
                };
            }

            // Update existing user
            const updatedUser = await User.findByIdAndUpdate(
                userData.userId,
                {
                    $set: {
                        ...userData
                    },
                },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                data: updatedUser,
                message: 'User updated successfully',
            };

        } catch (error: any) {
            // Handle validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err: any) => err.message);
                return {
                    success: false,
                    message: `Validation error: ${validationErrors.join(', ')}`,
                    error: error,
                };
            }

            // Handle duplicate key error
            if (error.code === 11000) {
                return {
                    success: false,
                    message: 'User with this company email already exists',
                    error: error,
                };
            }

            // Other errors
            return {
                success: false,
                message: 'Failed to create or update user',
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
            throw new AppError('Error fetching user.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async createBlankUser(companyId: string): Promise<{ _id: mongoose.Types.ObjectId }> {
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
            console.log("error at creating blank user : ", error)
            throw new AppError("Failed to create blank user", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUserById(userId: string): Promise<void> {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                throw new AppError('User not found', StatusCodes.NOT_FOUND);
            }
        } catch (error) {
            throw new AppError('Error deleting user.', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async bulkCreateUsers(users: any[], companyId: string) {
        try {
            const results = {
                success: true,
                totalRows: users.length,
                successfullyCreated: 0,
                errors: [] as any[],
                duplicates: [] as any[]
            };

            // Get company ObjectId
            const company = await Company.findById(companyId);
            if (!company) {
                return {
                    success: false,
                    message: "Company not found"
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
                            error: "Name and Company Email are required"
                        });
                        continue;
                    }

                    // Validate email format
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(userData.companyMail)) {
                        results.errors.push({
                            row: rowNumber,
                            data: userData,
                            error: "Invalid email format"
                        });
                        continue;
                    }

                    // Validate contact if provided
                    if (userData.contact && !/^\d{10}$/.test(userData.contact)) {
                        results.errors.push({
                            row: rowNumber,
                            data: userData,
                            error: "Contact number must be exactly 10 digits"
                        });
                        continue;
                    }

                    // Check if user already exists
                    const existingUser = await User.findOne({
                        companyMail: userData.companyMail,
                        company: company._id
                    });

                    if (existingUser) {
                        results.duplicates.push({
                            row: rowNumber,
                            data: userData,
                            existingUser: {
                                _id: existingUser._id,
                                name: existingUser.name,
                                companyMail: existingUser.companyMail
                            }
                        });
                        continue;
                    }

                    // Create new user
                    const newUser = new User({
                        name: userData.name.trim(),
                        companyMail: userData.companyMail.trim().toLowerCase(),
                        contact: userData.contact?.trim() || '',
                        address: userData.address?.trim() || '',
                        chapter: userData.chapter?.trim() || '',
                        businessName: userData.businessName?.trim() || '',
                        instagram: userData.instagram?.trim() || '',
                        facebook: userData.facebook?.trim() || '',
                        businessCategory: userData.businessCategory?.trim() || '',
                        specialisation: userData.specialisation?.trim() || '',
                        webnClubMember: userData.webnClubMember || false,
                        company: company._id,
                        learningStreak: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    await newUser.save();
                    results.successfullyCreated++;

                } catch (error: any) {
                    results.errors.push({
                        row: rowNumber,
                        data: userData,
                        error: error.message || "Failed to create user"
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

}

export default UserService;