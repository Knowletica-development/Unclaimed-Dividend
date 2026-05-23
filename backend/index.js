import express from "express";
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ErrorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.js";
import { loadDividendData } from "./utils/dividendCache.js";
import unclaimedDividendRouter from "./routes/unclaimedDividend.js";
import { loadCawasjiData } from "./utils/cawasjiLoader.js";

dotenv.config();

console.log("App starting...");

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Database connected!");

    console.log("Loading dividend data...");
    loadDividendData();
    console.log("Dividend data loaded!");

     console.log("Loading Cawasji dividend data...");
    loadCawasjiData()
    console.log("Dividend Cawasji data loaded!");

    const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      credentials: true,
      methods: "GET,POST,PUT,DELETE,PATCH",
      allowedHeaders: "Content-Type,Authorization,Origin,Accept",
    };

    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(morgan("dev"));

    // ========== ROUTES ==========
    app.get("/", (req, res) =>
      res.status(200).json({ success: true, message: "API WORKING" })
    );

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/unclaimedDividend", unclaimedDividendRouter);

    app.use(ErrorMiddleware);

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("STARTUP ERROR");
    console.error(error.stack || error);
    process.exit(1);
  }
};

startServer();
