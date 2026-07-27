import { GoogleGenAI } from "@google/genai";
import { z} from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";



const interviewReportSchema = z.object({
    mathScore:z.number().min(0).max(100).describe("The score of the candidate in the math test"),
    technicalQuestionSchema:z.array(z.object({
        questions:z.string().describe("The Technical question can be asked in the interview"),
        intentions:z.string().describe("The intention of interviewer behind asking this technical question"),
        answer:z.string().describe("how to answer this question,what point to be covered in answer,what to avoid in answer,what approach to take ,etc...")
    })).describe("List of technical questions that can be asked in the interview along with their intentions and answers"),
    behavioralQuestionSchema:z.array(z.object({
        questions:z.string().describe("The Behavioral question can be asked in the interview"),      
        intentions:z.string().describe("The intention of interviewer behind asking this behavioral question"),
        answer:z.string().describe("how to answer this question,what point to be covered in answer,what to avoid in answer,what approach to take ,etc...")
    })).describe("List of behavioral questions that can be asked in the interview along with their intentions and answers"),
    skillGapSchema:z.array(z.object({    
        skills:z.string().describe("The skill gap that the candidate has"),
        severity:z.enum(['low','medium','high']).describe("The severity of the skill gap")
    })).describe("List of skill gaps that the candidate has along with their severity"),
    preparationPlanSchema:z.array(z.object({
        day:z.number().describe("The day of the preparation plan"),
        focus:z.string().describe("The focus of the preparation plan for that day"),
        tasks:z.array(z.string()).describe("List of tasks to be completed on that day")
    })).describe("List of preparation plans for the candidate to improve their skills and prepare for the interview")
}).describe("Interview Report Schema");



async function generateInterviewReport({selfDescription,jobDescription,resume}) {

    try {
        const prompt = `
    You are an interview expert.

    Return ONLY valid JSON.

    Do not return field names as strings.

    Fill every field with realistic values.

    technicalQuestionSchema must be an array of OBJECTS.

    Example:

    {
    "mathScore": 82,

    "technicalQuestionSchema": [
        {
        "questions": "Explain JWT",
        "intentions": "Check authentication knowledge",
        "answer": "..."
        }
    ],

    "behavioralQuestionSchema": [
        {
        "questions": "Tell me about yourself",
        "intentions": "Check communication",
        "answer": "..."
        }
    ],

    "skillGapSchema": [
        {
        "skills": "Docker",
        "severity": "medium"
        }
    ],

    "preparationPlanSchema": [
        {
        "day": 1,
        "focus": "Node.js",
        "tasks": [
            "Learn Express",
            "Create REST API"
        ]
        }
    ]
    }

    Candidate:

    Resume:
    ${resume}

    Job Description:
    ${jobDescription}

    Self Description:
    ${selfDescription}
    `;
                        
    
        const ai = new GoogleGenAI({
        apiKey:process.env.GOOGLE_GENAI_API_KEY
        });
    
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents:prompt,
            config: {
                responseMimeType: "application/json",
            },
        });    
        
        return JSON.parse(response.text);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default generateInterviewReport;



        

    