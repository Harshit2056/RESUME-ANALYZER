import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true
})


// Function to generate interview report based on resumeFile, selfDescription, and jobDescription
export const generateInterviewReport = async({resumeFile,selfDescription,jobDescription})=>{
    try {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("selfDescription", selfDescription);
        formData.append("jobDescription", jobDescription);

        const response = await api.post("/api/interview", formData);
        return response.data;
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
}



// Function to get interview report by interviewId
export const getInterviewReportById = async(interviewId)=>{
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching interview report by ID:", error);
        throw error;
    }   
}

// Function to get all interview reports of the logged-in user  
export const getAllInterviewReports = async()=>{
    try {
        const response = await api.get("/api/interview/");
        return response.data;
    } catch (error) {
        console.error("Error fetching all interview reports:", error);
        throw error;
    }
}

export const generateResumePdf = async(interviewReportId)=>{
    try {
        const response = await api.get(`/api/interview/report/pdf/${interviewReportId}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        throw error;
    }
}
