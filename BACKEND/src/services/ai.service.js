import { GoogleGenAI } from "@google/genai";
import { z} from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";


const interviewReportSchema = z.object({
    mathScore:z.number().min(0).max(100).describe("The score of the candidate in the math test"),
    technicalQuestions:z.array(z.object({
        questions:z.string().describe("The Technical question can be asked in the interview"),
        intentions:z.string().describe("The intention of interviewer behind asking this technical question"),
        answer:z.string().describe("how to answer this question,what point to be covered in answer,what to avoid in answer,what approach to take ,etc...")
    })).describe("List of technical questions that can be asked in the interview along with their intentions and answers"),
    behavioralQuestions:z.array(z.object({
        questions:z.string().describe("The Behavioral question can be asked in the interview"),      
        intentions:z.string().describe("The intention of interviewer behind asking this behavioral question"),
        answer:z.string().describe("how to answer this question,what point to be covered in answer,what to avoid in answer,what approach to take ,etc...")
    })).describe("List of behavioral questions that can be asked in the interview along with their intentions and answers"),
    skillGaps:z.array(z.object({    
        skills:z.string().describe("The skill gap that the candidate has"),
        severity:z.enum(['low','medium','high']).describe("The severity of the skill gap")
    })).describe("List of skill gaps that the candidate has along with their severity"),
    preparationPlan:z.array(z.object({
        day:z.number().describe("The day of the preparation plan"),
        focus:z.string().describe("The focus of the preparation plan for that day"),
        tasks:z.array(z.string()).describe("List of tasks to be completed on that day")
    })).describe("List of preparation plans for the candidate to improve their skills and prepare for the interview")
}).describe("Interview Report Schema");



async function generateInterviewReport({selfDescription,jobDescription,resume}) {

    const prompt = `
    Generate ONLY valid JSON.

    Use exactly these keys:

    {
    "mathScore": number,
    "technicalQuestions": [
        {
        "questions": "",
        "intentions": "",
        "answer": ""
        }
    ],
    "behavioralQuestions": [
        {
        "questions": "",
        "intentions": "",
        "answer": ""
        }
    ],
    "skillGaps": [
        {
        "skills": "",
        "severity": "low | medium | high"
        }
    ],
    "preparationPlan": [
        {
        "day": 1,
        "focus": "",
        "tasks": []
        }
    ]
    }

    Candidate Details:

    Self Description:
    ${selfDescription}

    Job Description:
    ${jobDescription}

    Resume:
    ${resume}
    `;
                    

    const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents:prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        },
    });    
    
    return JSON.parse(response.text);
}

export default generateInterviewReport;



        

    