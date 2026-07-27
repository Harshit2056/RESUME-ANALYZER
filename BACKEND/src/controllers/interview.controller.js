import generateInterviewReport from "../services/ai.service.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asynchandler.js";
import { PDFParse} from "pdf-parse"
import fs from "fs";
import { interViewReportModel } from "../models/interviewReport.model.js";
import apiResponse from "../utils/apiResponse.js";

const generateInterviewReportController = asynchandler(async(req,res)=>{
    const {selfDescription,jobDescription} = req.body

    if(!selfDescription || !jobDescription){
        throw new apiError(400,"jobDescription and selfDescription is required")
    }

    if(!req.file){
        throw new apiError(400,"jobDescription and selfDescription is required")    
    }
    const pdfBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({
        data:pdfBuffer
    });
    const resumeContent = await parser.getText();


    const reportByAi = await generateInterviewReport({resume:resumeContent.text,selfDescription,jobDescription,})

    const interViewReport = await interViewReportModel.create({
        user: req.user.userId,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...reportByAi
    })

    return res
    .status(201)
    .json(new apiResponse(
        201,{interViewReport},"interview report generated succesfully"
    ))
   
})  

export {generateInterviewReportController}