import { Request, Response, NextFunction } from 'express';
import userService from '../service/user.service';
import { StatusCodes } from 'http-status-codes';
import User from '../model/user.model';
import AppError from '../../../utils/appError';
import Company from '../../company/model/company.model';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils';
import { setCookieOptions } from '../../../utils/cookieOptions';
const jwt = require('jsonwebtoken');
import LearningService from "../../learning/services/learning.service";
const learningService = new LearningService();

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        const userservice = new userService();
        const user = await userservice.getUserByIdWithCompany(userId);
        const { rank } = await userservice.getUserRankByStars(userId);
        const { progress } = await learningService.getLearningProgress(userId);
        res.status(StatusCodes.OK).json({ success: true, data: { ...user, rank, progress } });
    } catch (error) {
        next(error);
    }
};


// Controller for Login 

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { companyMail, companyCode } = req.body;

    const user = await User.findOne({ companyMail });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const company = await Company.findById(user.company);

    if (!company || !(companyCode === company.companyCode)) {
        return next(new AppError("Comapny code didn't match.", 404));
    }

    const accessToken = generateAccessToken(user._id.toString(), "USER", user.company.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("accessToken", accessToken, setCookieOptions);
    res.cookie("refreshToken", refreshToken, { ...setCookieOptions, httpOnly: true });
    res.json({ success: true, accessToken });

};



export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return next(new AppError("Refresh token missing", 401));
        }

        // Verify refresh token
        let payload;
        try {
            payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
        } catch (err) {
            return next(new AppError("Invalid refresh token", 403));
        }

        const user = await User.findById(payload.id);
        if (!user) {
            return next(new AppError("User not found", 404));
        }

        const accessToken = generateAccessToken(user._id.toString(), "USER", user.company.toString());
        res.cookie("accessToken", accessToken, setCookieOptions);
        res.json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};