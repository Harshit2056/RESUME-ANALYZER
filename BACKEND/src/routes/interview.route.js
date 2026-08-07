import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { generateInterviewReportController } from "../controllers/interview.controller.js";
import { getInterviewReportById } from "../controllers/interview.controller.js";
import { getAllInterviewReports } from "../controllers/interview.controller.js";   
import { generateResumePdfController } from "../controllers/interview.controller.js"; 

const interviewRouter = Router();

interviewRouter.route("/").post(verifyJWT,upload.single("resume"),generateInterviewReportController)

interviewRouter.route("/report/:interviewId").get(verifyJWT,getInterviewReportById)

interviewRouter.route("/reports").get(verifyJWT,getAllInterviewReports)

interviewRouter.route("/report/pdf/:interviewReportId").get(verifyJWT,generateResumePdfController)

export {interviewRouter}