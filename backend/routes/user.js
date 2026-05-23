import express from "express";
import {
  activateUser,
  generateResetPasswordToken,
  getCawasjiDetails,
  getCurrentUser,
  getDividends,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registrationUser,
  resetPassword,
} from "../controllers/user.js";
import { hasRole, isAuthenticated } from "../middlewares/auth.js";
import { createUploadMiddleware } from "../utils/multerConfig.js";

const userRouter = express.Router();

const uploadKycDocuments = createUploadMiddleware([
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "idProof", maxCount: 1 },
]);

//user api

userRouter.post("/register", registrationUser);

userRouter.post("/activate-user", activateUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", isAuthenticated, logoutUser);

userRouter.post("/refresh-token", refreshAccessToken);

userRouter.get(
  "/me",
  isAuthenticated,
  hasRole("user", "admin", "agent", "sponsorer"),
  getCurrentUser,
);

userRouter.get("/dividend-data", getDividends);

userRouter.get("/cawasji-details", getCawasjiDetails);

userRouter.post("/generate-reset-token", generateResetPasswordToken);

userRouter.post("/new-password", resetPassword);

export default userRouter;
