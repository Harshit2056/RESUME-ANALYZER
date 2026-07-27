import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { generateInterviewReportController } from "../controllers/interview.controller.js";


const interviewRouter = Router();

interviewRouter.route("/interview").post(verifyJWT,upload.single("resume"),generateInterviewReportController)

export {interviewRouter}