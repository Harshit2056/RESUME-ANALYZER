import { getAllInterviewReports } from "../services/interview.api";
import { getInterviewReportById } from "../services/interview.api";
import { generateInterviewReport } from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";


export const useInterview = () =>{
    const context = useContext(InterviewContext)


    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }
    
    const {loading,setLoading,reports,setReports,report,setReport} = context

    const handleGenerateInterviewReport = async({resumeFile,selfDescription,jobDescription})=>{
        setLoading(true)
        try {
            const response = await generateInterviewReport({resumeFile,selfDescription,jobDescription})
            setReport(response.data.interviewReport)
            return response;
        } catch (error) {
            console.log(error)
            return false;
        } finally{
            setLoading(false)
        }
    }

    const handleGetInterviewReportById = async(interviewId)=>{
        setLoading(true)    
        try {
            const response = await getInterviewReportById({interviewId})
            setReport(response.data.interviewReport)
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }   
        finally{
            setLoading(false)
        }
    }

    const handleGetAllInterviewReports = async()=>{ 
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.data.interviewReports)
            return true;
        } catch (error) {
            console.log(error)
            return false;
        } finally {
            setLoading(false)
        }
    }   

return {
    loading,
    report, 
    reports,
    handleGenerateInterviewReport,
    handleGetInterviewReportById,
    handleGetAllInterviewReports
}
}
