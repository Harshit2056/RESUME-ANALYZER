import {generateInterviewReport} from "../services/ai.service.js";
import {generateResumePdf} from "../services/ai.service.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asynchandler.js";
import { PDFParse} from "pdf-parse"
import fs from "fs";
import { interviewReportModel } from "../models/interviewReport.model.js";
import apiResponse from "../utils/apiResponse.js";

//constroller to generate interview report based on resume,selfDescription and jobDescription
const generateInterviewReportController = asynchandler(async(req,res)=>{
    const {selfDescription,jobDescription} = req.body

    if(!jobDescription?.trim()){
        throw new apiError(400,"jobDescription is required")
    }

    if(!req.file && !selfDescription?.trim()){
        throw new apiError(400,"jobDescription and selfDescription is required")    
    }
    let resumeText = "";
    if (req.file) {
        const pdfBuffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({
            data: pdfBuffer
        });
        const parsed = await parser.getText();
        resumeText = typeof parsed === 'string' ? parsed : (parsed?.text || "");
    }

    const reportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...reportByAi
    });

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

//controller to generate pdf from html content based on resume,selfDescription and jobDescription
const generateResumePdfController = asynchandler(async(req,res)=>{
    const {interviewId} = req.params

    console.log("req.params =", req.params);
console.log("interviewId =", interviewId);
console.log("typeof =", typeof interviewId);

    const interviewReport = await interviewReportModel.findById(interviewId)

    if(!interviewReport){
        throw new apiError(404,"interview report not found")
    }

    const {selfDescription,jobDescription,resume} = interviewReport

    const pdfBuffer = await generateResumePdf({resume,selfDescription,jobDescription})

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(pdfBuffer);
})


export {generateInterviewReportController,getInterviewReportById,getAllInterviewReports,generateResumePdfController}