import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createUploadMiddleware } from "../utils/multerConfig.js";
import {
  createUnclaimedDividend,
  getMyUnclaimedDividends,
  updateUnclaimedDividend,
} from "../controllers/unclaimedDividend.js";

const unclaimedDividendRouter = express.Router();

const unclaimedUpload = createUploadMiddleware([
  { name: "idProof", maxCount: 1 },
  { name: "shareCertificate", maxCount: 1 },
  { name: "cancelCheque", maxCount: 1 },
  { name: "indemnityBond", maxCount: 1 },
]);

unclaimedDividendRouter.post(
  "/create",
  isAuthenticated,
  unclaimedUpload,
  createUnclaimedDividend
);

unclaimedDividendRouter.put(
  "/update/:id",
  isAuthenticated,
  unclaimedUpload,
  updateUnclaimedDividend
);

unclaimedDividendRouter.get("/my-claim", isAuthenticated, getMyUnclaimedDividends);

export default unclaimedDividendRouter;
