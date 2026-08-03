import generateInterviewReport from "../services/ai.service.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asynchandler.js";
import { PDFParse} from "pdf-parse"
import fs from "fs";
import { interviewReportModel } from "../models/interviewReport.model.js";
import apiResponse from "../utils/apiResponse.js";

//constroller to generate interview report based on resume,selfDescription and jobDescription
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

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...reportByAi
    })

    return res
    .status(201)
    .json(new apiResponse(
        201,{interviewReport},"interview report generated succesfully"
    ))
   
})  


//controller to get interview report by using interviewId
const getInterviewReportById = asynchandler (async(req,res)=>{
    const {interviewId} = req.params

   

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user._id
    })

    if(!interviewReport){
        throw new apiError(404,"interview report not found")
    }

    return res
    .status(200)
    .json(new apiResponse(
        200,{interviewReport},"interview report fetched successfully"
    ))
})

//controller to get all interview reports of a logged in user
const getAllInterviewReports = asynchandler(async(req,res)=>{
    const interviewReports = await interviewReportModel
    .find({user: req.user._id})
    .sort({createdAt:-1})
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestionSchema -behavioralQuestionSchema -skillGapSchema -preparationPlanSchema")

    return res
    .status(200)
    .json(new apiResponse(
        200,{interviewReports},"interview reports fetched successfully"
    ))
})

export {generateInterviewReportController,getInterviewReportById,getAllInterviewReports}