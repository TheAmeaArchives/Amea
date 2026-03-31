import { mkdir } from "node:fs/promises";
import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./api/index.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handlers.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const uploadDirectory = path.resolve(process.cwd(), env.UPLOAD_DIRECTORY);
void mkdir(uploadDirectory, { recursive: true });
app.use("/uploads", express.static(uploadDirectory));

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
