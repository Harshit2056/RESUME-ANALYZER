import mongoose, { mongo } from "mongoose"

/**
 * job description - type:string
 * resume text - type:string
 * self description - type:string
 * 
 * -matchScore: type:number
 * 
 * - technical questions : 
 *          [{
 *              questions: "",
 *              intention:"",
 *              answer:""
 *          }]
 * - behavioral questions :
 *          [{
 *              questions: "",
 *              intention:"",
 *              answer:""
 *          }]
 * - skill gaps :
 *          [{
 *              skills:"",
 *              severity:{
 *                          type:string
 *                          enum:['low','medium','high']
 *                      }
 *          }]
 * - preparation plan :[{
 *          day: type:number,
 *          focus : type:string,
 *          tasks: [type:string]
 * },{day2}....]
 */

const technicalQuestionSchema = new mongoose.Schema({
    questions:{
        type:String,
        required:[true,"technical question is required"]
    },
    intentions:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"answer question is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
    questions:{
        type:String,
        required:[true,"behavioral question is required"]
    },
    intentions:{
        type:String,
        required:[true,"intention question is required"]
    },
    answer:{
        type:String,
        required:[true,"answer question is required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skills:{
        type:"string",
        required:[true,"skills is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type:String,
        require:[true,"Task is required"]
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required:[true,"job Description is required"]
    },

    resume:{
        type:String,
    },

    selfDescription:{
        type:String
    },

    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestionSchema:[technicalQuestionSchema],
    behavioralQuestionSchema:[behavioralQuestionSchema],
    skillGapSchema:[skillGapSchema],
    preparationPlanSchema:[preparationPlanSchema]
},{timestamps:true})

export const interViewReportModel = mongoose.model("interviewReportModel",interviewReportSchema)