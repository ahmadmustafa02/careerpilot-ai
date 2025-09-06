import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
import React, { useState } from 'react'

// Define the type for the AI report
interface AiReportType {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  sections: {
    contact_info: {
      score: number;
      comment: string;
    };
    experience: {
      score: number;
      comment: string;
    };
    education: {
      score: number;
      comment: string;
    };
    skills: {
      score: number;
      comment: string;
    };
  };
  tips_for_improvement: string[];
  whats_good: string[];
  needs_improvement: string[];
}

interface ReportProps {
  aiReport: AiReportType | null;
}

function Report({aiReport}: ReportProps) {
  console.log("Report received aiReport:", aiReport);
  console.log("aiReport type:", typeof aiReport);
  console.log("aiReport.overall_score:", aiReport?.overall_score);
   const [openResumeUpload, setResumeDialog]= useState(false);

  // Add null check and debug info
  if (!aiReport) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Analysis...</h2>
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">AI Analysis Results</h2>
<button
  type="button"
  className="text-white bg-black hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 gradient-button-bg shadow-lg"
  onClick={()=> setResumeDialog(true)}
>
  Re-analyze <i className="fa-solid fa-sync ml-2"></i>
</button>
</div>

      {/* Resume Score */}
      <div className="bg-gradient-to-r from-[#BE575F] via-[#A338E3] to-[#AC76D6] rounded-lg shadow-md p-6 mb-6 border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
        </h3>
        <div className="flex items-center justify-between mb-4">
           <span className="text-6xl font-extrabold text-white">
              {aiReport?.overall_score || 0}
              <span className="text-2xl">/100</span>
            </span>
            <div className="flex items-center">
                <i className="fas fa-arrow-up text-green-500 text-lg mr-2"></i>
                <span className="text-green-500 text-lg font-bold">
                  {aiReport?.overall_feedback || "Good!"}
                </span>
            </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-white h-2.5 rounded-full" 
              style={{ width: `${aiReport?.overall_score || 0}%` }}
            ></div>
        </div>
        <p className="text-gray-200 text-sm">
          {aiReport?.summary_comment || "Your resume is being analyzed..."}
        </p>
      </div>

      {/* Section Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              <i className="fas fa-user-circle text-gray-500 mr-2"></i> Contact Info
            </h4>
            <span className="text-4xl font-bold highlight-text">
              {aiReport?.sections?.contact_info?.score || 0}%
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {aiReport?.sections?.contact_info?.comment || "Analyzing..."}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              <i className="fas fa-briefcase text-gray-500 mr-2"></i> Experience
            </h4>
            <span className="text-4xl font-bold highlight-text">
              {aiReport?.sections?.experience?.score || 0}%
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {aiReport?.sections?.experience?.comment || "Analyzing..."}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border border-yellow-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              <i className="fas fa-graduation-cap text-gray-500 mr-2"></i> Education
            </h4>
            <span className="text-4xl font-bold warning-text">
              {aiReport?.sections?.education?.score || 0}%
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {aiReport?.sections?.education?.comment || "Analyzing..."}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border border-red-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              <i className="fas fa-lightbulb text-gray-500 mr-2"></i> Skills
            </h4>
            <span className="text-4xl font-bold danger-text">
              {aiReport?.sections?.skills?.score || 0}%
            </span>
            <p className="text-sm text-gray-600 mt-2">
              {aiReport?.sections?.skills?.comment || "Analyzing..."}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Tips & Improvements */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
            <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
        </h3>
        <ol className="list-none space-y-4">
          {aiReport?.tips_for_improvement?.map((tip: string, index: number) => (
            <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                  <i className="fas fa-check"></i>
                </span>
                <div>
                    <p className="text-gray-600 text-sm">{tip}</p>
                </div>
            </li>
          )) || (
            <li className="text-gray-500">Loading tips...</li>
          )}
        </ol>
      </div>

      {/* What's Good / Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good
            </h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              {aiReport?.whats_good?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || (
                <li className="text-gray-500">Loading strengths...</li>
              )}
            </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement
            </h3>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              {aiReport?.needs_improvement?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || (
                <li className="text-gray-500">Loading improvements...</li>
              )}
            </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6 text-center gradient-button-bg">
        <h3 className="text-2xl font-bold mb-3">Ready to refine your resume? 💪</h3>
        <p className="text-base mb-4">Make your application stand out with our premium insights and features.</p>
        <button type="button" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
            Upgrade to Premium <i className="fas fa-arrow-right ml-2 text-blue-600"></i>
        </button>
      </div>
      <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={()=>setResumeDialog(false)} recordId/>
    </div>
  )
}

export default Report