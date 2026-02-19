import User from "../models/userModal.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CatchAsyncError } from "./CatchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new ErrorHandler("Session expired. Please login again.", 401));
      }
      return next(new ErrorHandler("Invalid token. Please login.", 401));
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshTokenHash");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // if (!user.isActive || user.isDeleted) {
    //   return next(new ErrorHandler("Account inactive or deleted. Contact support.", 403));
    // }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return next(new ErrorHandler("Authentication failed", 401));
  }
};

export const hasRole = (...allowedRoles) => {
  return CatchAsyncError(async (req, res, next) => {
    const userId = req.user?._id;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized. Please login.", 401));
    }

    const user = await User.findById(userId).select("role");

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }
    if (!allowedRoles.includes(user.role)) {
      return next(
        new ErrorHandler(
          `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
          403
        )
      );
    }

    next();
  });
};