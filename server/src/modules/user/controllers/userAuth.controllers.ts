import { Request, Response, NextFunction } from "express";
import userService from "../service/user.service";
import { StatusCodes } from "http-status-codes";
import User from "../model/user.model";
import UserOtp from "../model/userOtp.model";
import AppError from "../../../utils/appError";
import Company from "../../company/model/company.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwtUtils";
import { setCookieOptions } from "../../../utils/cookieOptions";
import generateOtp from "../../../utils/generateOtp";
const jwt = require("jsonwebtoken");
import LearningService from "../../learning/services/learning.service";
import mongoose from "mongoose";
import userOtpTrigger from "../../../services/emails/triggers/user/userOtpTrigger";
const learningService = new LearningService();

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userservice = new userService();
    const user = await userservice.getUserByIdWithCompany(userId);
    const { rank } = await userservice.getUserRankByStars(userId);
    const { progress } = await learningService.getLearningProgress(userId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: { ...user, rank, progress } });
  } catch (error) {
    next(error);
  }
};

// Controller for Login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { companyMail, companyCode } = req.body;

  const user = await User.findOne({
    companyMail: { $regex: new RegExp(`^${companyMail}$`, "i") },
  });

  console.log("User", user);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const company = await Company.findById(user.company);

  if (!company || !(companyCode === company.companyCode)) {
    return next(new AppError("Comapny code didn't match.", 404));
  }

  const accessToken = generateAccessToken(
    user._id.toString(),
    "USER",
    user.company.toString()
  );
  const refreshToken = generateRefreshToken(user._id.toString());

  res.cookie("accessToken", accessToken, setCookieOptions);
  res.cookie("refreshToken", refreshToken, {
    ...setCookieOptions,
    httpOnly: true,
  });
  res.json({ success: true, accessToken });
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("accessToken", setCookieOptions);
    res.clearCookie("refreshToken", { ...setCookieOptions, httpOnly: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const accessToken = generateAccessToken(
      user._id.toString(),
      "USER",
      user.company.toString()
    );
    res.cookie("accessToken", accessToken, setCookieOptions);
    res.json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
};

// New OTP-based authentication controllers

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyMail } = req.body;

    if (!companyMail) {
      return next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
    }

    // Check if user exists
    const user = await User.findOne({
      companyMail: { $regex: new RegExp(`^${companyMail}$`, "i") },
    });

    if (!user) {
      return next(
        new AppError(
          "User not found. Please signup first.",
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Delete any existing OTP for this user
    await UserOtp.deleteMany({ user: user._id });

    // Generate new OTP
    const otp = generateOtp();

    // Save OTP to database
    await UserOtp.create({
      user: user._id,
      otp,
    });

    // Send OTP email
    await userOtpTrigger({ email: companyMail, otp });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyMail } = req.body;

    if (!companyMail) {
      return next(new AppError("Email is required", StatusCodes.BAD_REQUEST));
    }

    const user = await User.findOne({ companyMail });
    if (!user) {
      return next(new AppError("User not found", StatusCodes.NOT_FOUND));
    }

    // Delete existing OTP
    await UserOtp.deleteMany({ user: user._id });

    // Generate new OTP
    const otp = generateOtp();

    // Save new OTP to database
    await UserOtp.create({
      user: user._id,
      otp,
    });

    // Send OTP email
    await userOtpTrigger({ email: companyMail, otp });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP resent successfully to your email",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyMail, otp } = req.body;

    if (!companyMail || !otp) {
      return next(
        new AppError("Email and OTP are required", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await User.findOne({
      companyMail: { $regex: new RegExp(`^${companyMail}$`, "i") },
    });

    if (!user) {
      return next(new AppError("User not found", StatusCodes.NOT_FOUND));
    }

    // Find the OTP record
    const otpRecord = await UserOtp.findOne({ user: user._id });
    if (!otpRecord) {
      return next(
        new AppError(
          "OTP expired or not found. Please request a new OTP",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Verify OTP
    const isOtpValid = await otpRecord.compareOtp(otp);
    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", StatusCodes.BAD_REQUEST));
    }

    // Delete the used OTP
    await UserOtp.deleteOne({ _id: otpRecord._id });

    // Generate tokens
    const accessToken = generateAccessToken(
      user._id.toString(),
      "USER",
      user.company.toString()
    );
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("accessToken", accessToken, setCookieOptions);
    res.cookie("refreshToken", refreshToken, {
      ...setCookieOptions,
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      companyMail,
      name,
      businessName,
      contact,
      businessCategory,
      designation,
      currentStage,
      communityGoal,
      interestedEvents,
      ref,
    } = req.body;

    // Validate required fields
    if (
      !companyMail ||
      !name ||
      !businessName ||
      !contact ||
      !businessCategory
    ) {
      return next(
        new AppError("All fields are required", StatusCodes.BAD_REQUEST)
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ companyMail });
    if (existingUser) {
      return next(
        new AppError(
          "User already exists. Please login instead.",
          StatusCodes.CONFLICT
        )
      );
    }

    // Get the default company (WEBN Community)
    const defaultCompanyId = new mongoose.Types.ObjectId(
      "67f7b486db92440936790acb"
    );

    // Create new user
    const newUser = await User.create({
      companyMail,
      name,
      businessName,
      contact,
      businessCategory,
      designation,
      currentStage,
      communityGoal,
      interestedEvents,
      totalStars: 50,
      company: defaultCompanyId,
      webnClubMember: false,
    });

    if (ref) {
      const referringUser = await User.findById(ref);
      if (referringUser) {
        newUser.referredBy = referringUser._id;
        referringUser.totalStars += 50;
        await Promise.all([newUser.save(), referringUser.save()]);
      }
    }

    // Generate and send OTP for immediate login
    const otp = generateOtp();
    await UserOtp.create({
      user: newUser._id,
      otp,
    });

    await userOtpTrigger({ email: companyMail, otp });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "Account created successfully! OTP sent to your email for login.",
      user: {
        id: newUser._id,
        name: newUser.name,
        companyMail: newUser.companyMail,
      },
    });
  } catch (error) {
    next(error);
  }
};
