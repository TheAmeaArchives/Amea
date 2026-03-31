import { Router } from "express";
import { adminRouter } from "../routes/admin.js";
import { memberRouter } from "../routes/member.js";
import { publicRouter } from "../routes/public.js";

export const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    message: "API ready",
  });
});

apiRouter.use("/public", publicRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/member", memberRouter);
