import path from "path";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import helmet from "helmet";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { connect, disconnect, set } from "mongoose";
import morgan from "morgan";
import { winstonLogger } from "./config";
import { PORT } from "./config/envs";
import { dbConnection } from "./database";
import {
  globalErrorHandler,
  globalNotFoundHandler,
} from "./middlewares/common";
import router from "./routes";

export const app = express();

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    set("strictQuery", true);
    await connect(dbConnection.url);
    console.log("Connected to MongoDB");
  } catch (error) {
    winstonLogger.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

// Initialize the app
const startServer = async () => {
  await connectToDatabase();

  app.get("/api", (req: Request, res: Response) => {
    winstonLogger.info("Log: ");
    const data = { message: "Hello, MuzzGen 🤩!" };
    res
      .status(StatusCodes.OK)
      .json({ data, message: getReasonPhrase(StatusCodes.OK) });
  });

  app.use("/api", router);
  app.use(globalNotFoundHandler);
  app.use(globalErrorHandler);

  const server = app.listen(PORT, () => {
    winstonLogger.info(`=================================`);
    winstonLogger.info(`🚀 App listening on the port ${PORT}`);
    winstonLogger.info(`=================================`);
  });
};

startServer();
