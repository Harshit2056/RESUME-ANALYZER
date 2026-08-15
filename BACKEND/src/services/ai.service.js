import { GoogleGenAI } from "@google/genai";
import { z} from "zod"
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";


async function generateInterviewReport({selfDescription,jobDescription,resume}) {

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
    })).describe("List of preparation plans for the candidate to improve their skills and prepare for the interview"),
    title:z.string().describe("The title of the interview report for which the report is generated"),
}).describe("Interview Report Schema");

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
    },
    'title': 'Software Engineer Interview Report'

    The JSON must be valid and parsable.

    If Resume is not provided, generate the report using Self Description.

    If Self Description is not provided, generate the report using Resume.

    If both are provided, combine information from both.

    Candidate:

    Resume:
    ${resume || "No resume provided"}

    Job Description:
    ${jobDescription}

    Self Description:
    ${selfDescription || "No self-description provided"}
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

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4',margin: {top: '20px', right: '20px', bottom: '20px', left: '20px'} });
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({resume,selfDescription,jobDescription}) {
    const resumepdfSchema = z.object({
        html:z.string().describe("The HTML content of the resume PDF which can be converted to PDF using any HTML to PDF converter like Puppeteer or jsPDF")
    });

    try {
        const prompt = `You are a world-class Resume Writer, ATS Expert, and Professional HTML Resume Designer.

        Your task is to generate a COMPLETE, modern, ATS-friendly resume in HTML format.

        The resume should be based on the candidate's resume, self-description, and target job description.

        Requirements:

        - Return ONLY valid JSON.
        - Do NOT return Markdown.
        - Do NOT return explanations.
        - The JSON must contain ONLY one property:

        {
        "html": "<!DOCTYPE html>...</html>"
        }

        The "html" value must contain a COMPLETE HTML document including:

        - <!DOCTYPE html>
        - <html>
        - <head>
        - <style>
        - <body>

        Design Requirements:

        - Modern professional layout
        - ATS friendly
        - Clean typography
        - Black & white print friendly
        - No JavaScript
        - Inline CSS only
        - Single page whenever possible
        - Proper spacing
        - Professional section headings
        - Responsive layout
        - Use semantic HTML

        Resume Sections:

        - Name
        - Contact Information
        - Professional Summary
        - Technical Skills
        - Education
        - Projects
        - Experience (if available)
        - Certifications (if available)
        - Achievements
        - Positions of Responsibility
        - Languages (if available)

        Resume Improvements:

        - Rewrite weak bullet points into impactful achievement-based bullets.
        - Quantify achievements wherever possible.
        - Highlight technologies used.
        - Match the resume with the target job description.
        - Optimize keywords for ATS.
        - Improve grammar and readability.
        - Remove unnecessary repetition.
        - Present projects professionally.

        Do NOT fabricate fake experience.

        If some information is missing, intelligently reorganize the available information instead of inventing new facts.

        Candidate Information

        Resume:
        ${resume}

        Self Description:
        ${selfDescription}

        Target Job Description:
        ${jobDescription}

        Return ONLY:

        {
        "html":"<!DOCTYPE html>....complete html....</html>"
        }
        `;
    const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
    });
    
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents:prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(resumepdfSchema),
        },
    });    
    const jsonContent = JSON.parse(response.text);

        const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
        return pdfBuffer;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {generateInterviewReport, generateResumePdf};



        

    