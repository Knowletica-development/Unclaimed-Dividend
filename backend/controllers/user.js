import { CatchAsyncError } from "../middlewares/CatchAsyncError.js";
import User from "../models/userModal.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { fileURLToPath } from "url";
import { sendMail } from "../utils/sendMail.js";
import Audit from "../models/auditModal.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { readXLSXFile } from "../utils/xlsxReader.js";
import { getDividendData } from "../utils/dividendCache.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\d{10,15}$/;

export const registrationUser = CatchAsyncError(async (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body;

  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }
  if (!password) {
    return next(new ErrorHandler("Password is required", 400));
  }
  if (!confirmPassword) {
    return next(new ErrorHandler("Confirm Password is required", 400));
  }

  name = name.trim();
  email = email.toLowerCase().trim();

  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  if (!passwordRegex.test(password)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and include uppercase, lowercase, and number",
        400
      )
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  const tempUser = {
    name,
    email,
    password,
  };

  const { token, activationCode } = createActivationToken(tempUser);

  try {
    await sendMail({
      email,
      subject: "Verify Your Email",
      template: "activation-mail.ejs",
      data: {
        user: { name },
        activationCode,
      },
    });

    res.cookie("activationToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `Activation code sent to ${email}`,
    });
  } catch (error) {
    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

export const createActivationToken = (user) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let activationCode = "";
  for (let i = 0; i < 6; i++) {
    activationCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

export const resendActivationOtp = CatchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(
      new ErrorHandler("Email already registered. Please login instead.", 400)
    );

  const tempUser = { email };
  const { token, activationCode } = createActivationToken(tempUser);

  try {
    await sendMail({
      email,
      subject: "Your Activation Code",
      template: "activation-mail.ejs",
      data: { user: { email }, activationCode },
    });

    res.cookie("activationToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: `A new activation code has been sent to ${email}. Please check your inbox.`,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

export const activateUser = CatchAsyncError(async (req, res, next) => {
  const { activation_code } = req.body;
  const token = req.cookies.activationToken;

  if (!token) {
    return next(new ErrorHandler("Activation token is missing", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
  } catch (err) {
    return next(new ErrorHandler("Activation token expired or invalid", 400));
  }

  if (decoded.activationCode !== activation_code) {
    return next(new ErrorHandler("Invalid Activation Code", 400));
  }

  const { name, email, password } = decoded.user;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newUser] = await User.create([{ name, email, password }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    newUser.password = undefined;
    res.clearCookie("activationToken");

    res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      user: newUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
});

export const loginUser = CatchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select(
    "+password +refreshTokenHash"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  if (user.lockDate && user.lockDate > Date.now()) {
    const remainingMinutes = Math.ceil((user.lockDate - Date.now()) / 60000);
    return next(
      new ErrorHandler(
        `Account is locked due to multiple failed attempts. Try again in ${remainingMinutes} minute(s).`,
        403
      )
    );
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    user.incrementLoginAttempts();
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  user.loginAttempts = 0;
  user.lockDate = null;
  user.lastActive = Date.now();

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  user.refreshTokenHash = refreshTokenHash;
  await user.save({ validateBeforeSave: false });

  await Audit.create({
    userId: user._id,
    type: "login",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash,
    isRevoked: false,
  });

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  const userResponse = await User.findById(user._id).select(
    "-password -refreshTokenHash -twoFactorSecret -mfaRecoveryCodes"
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: userResponse,
  });
});

export const logoutUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const refreshToken = req.cookies.refreshToken;

  if (!userId || !refreshToken) {
    return next(new ErrorHandler("Invalid request or user not logged in", 400));
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const user = await User.findById(userId);
  if (user) {
    user.refreshTokenHash = null;
    await user.save({ validateBeforeSave: false });
  }

  const latestAudit = await Audit.findOne({ user: userId }).sort({
    createdAt: -1,
  });
  if (latestAudit) {
    latestAudit.logoutAt = new Date();
    latestAudit.isRevoked = true;
    await latestAudit.save();
  }

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const refreshAccessToken = CatchAsyncError(async (req, res, next) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    return next(
      new ErrorHandler("Unauthorized request! No refresh token provided", 401)
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(incomingRefreshToken)
      .digest("hex");
    if (incomingTokenHash !== user.refreshTokenHash) {
      return next(
        new ErrorHandler("Refresh token is invalid or revoked!", 401)
      );
    }

    const accessToken = await user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    await Audit.create({
      userId: user._id,
      type: "refresh_token",
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
      deviceInfo: req.headers["user-agent"] || "Unknown",
      refreshTokenHash: user.refreshTokenHash,
      isRevoked: false,
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ErrorHandler("Refresh token expired. Please login again.", 401)
      );
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid refresh token.", 401));
    }
    return next(new ErrorHandler(error.message, 500));
  }
});

export const generateResetPasswordToken = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) return next(new ErrorHandler("Email is required!", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found!", 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendMail({
      email: user.email,
      subject: "Password Reset Request",
      template: "reset-password.ejs",
      data: {
        user,
        resetLink: resetUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token) return next(new ErrorHandler("Reset token is missing", 400));
  if (!newPassword || !confirmPassword)
    return next(
      new ErrorHandler("Both newPassword and confirmPassword are required", 400)
    );
  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return next(
      new ErrorHandler(
        "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
        400
      )
    );
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return next(new ErrorHandler("Invalid or expired reset token", 400));

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const getCurrentUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) return next(new ErrorHandler("Unauthorized access", 401));

  const user = await User.findById(userId).select(
    "-password -refreshTokenHash -twoFactorToken -mfaRecoveryCodes"
  );

  if (!user) return next(new ErrorHandler("User not found", 404));

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  await Audit.create({
    userId: user._id,
    type: "profile_access",
    ipAddress: req.ip || req.headers["x-forwarded-for"] || "Unknown",
    location: (req.body && req.body.location) || "Unknown",
    deviceInfo: req.headers["user-agent"] || "Unknown",
    refreshTokenHash: "",
    isRevoked: false,
  });

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    user,
  });
});

export const getDividends = (req, res) => {
  try {
    let data = getDividendData(); 
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No dividend data found",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const search = req.query.search?.trim().toLowerCase() || "";
    const pincode = req.query.pincode?.trim() || "";
    const company = req.query.company?.trim().toLowerCase() || "";
    const sortField = req.query.sort || null;
    const sortOrder = req.query.order === "desc" ? "desc" : "asc";

    if (search || pincode || company) {
      data = data.filter((row) => {
        const matchSearch = search 
          ? (row["Investor Name"] && String(row["Investor Name"]).toLowerCase().includes(search))
          : true;

        const matchPincode = pincode 
          ? (row["Pincode"] && String(row["Pincode"]).trim().startsWith(pincode.trim()))
          : true;

        const matchCompany = company 
          ? (row["Company Name"] && String(row["Company Name"]).toLowerCase().includes(company))
          : true;

        return matchSearch && matchPincode && matchCompany;
      });
    }

    // 2. Sorting Phase
    if (sortField) {
      data.sort((a, b) => {
        const valA = a[sortField] ?? "";
        const valB = b[sortField] ?? "";

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    // 3. Analytics Summary (Over the filtered dataset)
    const uniqueCompaniesSet = new Set();
    let totalClaimedCount = 0;
    let totalUnclaimedCount = 0;
    
    const analyticsSummary = data.reduce(
      (acc, row) => {
        const amount = Number(row["Amount"]) || 0;
        const shares = Number(row["No. Of Shares"]) || 0;
        const value = Number(row["Value"]) || 0;
        
        if (row["Company Name"]) {
          uniqueCompaniesSet.add(String(row["Company Name"]).trim());
        }

        acc.totalUnclaimedAmount += amount;
        acc.totalSharesTracked += shares;
        acc.totalEstimatedValue += value;

        // Status counting logic (Matching our formula below)
        if (amount > 50) {
          totalUnclaimedCount++;
        } else {
          totalClaimedCount++;
        }
        
        return acc;
      },
      { totalUnclaimedAmount: 0, totalSharesTracked: 0, totalEstimatedValue: 0 }
    );

    analyticsSummary.totalUnclaimedAmount = Number(analyticsSummary.totalUnclaimedAmount.toFixed(2));
    analyticsSummary.totalEstimatedValue = Number(analyticsSummary.totalEstimatedValue.toFixed(2));
    analyticsSummary.totalUniqueCompanies = uniqueCompaniesSet.size;
    analyticsSummary.globalClaimedRecords = totalClaimedCount;
    analyticsSummary.globalUnclaimedRecords = totalUnclaimedCount;

    // 4. Pagination Phase
    const total = data.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedData = data.slice(startIndex, endIndex);

    // 5. THE MAGIC: Row-Level Calculations & Status Mapping ✨
    // Frontend par har card ko ye computed data milega
    const enhancedData = paginatedData.map((row) => {
      const currentPrice = Number(row["Current Share Price"]) || 0;
      const dividendDeclared = Number(row["Dividend Declared"]) || 0;
      const amount = Number(row["Amount"]) || 0;

      // Formula A: Dividend Yield % Calculation
      const dividendYield = currentPrice > 0 
        ? Number(((dividendDeclared / currentPrice) * 100).toFixed(2)) 
        : 0;

      // Formula B: Dynamic Claim Status Logic
      // Rule: Agar amount ₹50 se bada hai, toh government IEPF account mein fasa hai (Unclaimed).
      // Agar bohot chota ya negligible amount hai, toh it might be processed/settled already (Claimed).
      const claimStatus = amount > 50 ? "Unclaimed" : "Claimed/Settled";

      return {
        ...row,
        "Dividend Yield %": dividendYield, // New Calculated Field
        "Claim Status": claimStatus,       // New Status Field
      };
    });

    // 6. Response
    res.status(200).json({
      success: true,
      meta: {
        totalRecords: total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
        analyticsSummary: analyticsSummary 
      },
      data: enhancedData, 
    });

  } catch (error) {
    console.error("Error fetching dividend data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dividend data",
      error: error.message,
    });
  }
};
