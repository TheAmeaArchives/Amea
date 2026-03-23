import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./api";
import { errorHandler, notFoundHandler } from "./middleware/error-handlers";
import { healthRouter } from "./routes/health";

export const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/health", healthRouter);
app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
