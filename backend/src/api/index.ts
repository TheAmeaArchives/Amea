import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    message: "API ready",
  });
});
