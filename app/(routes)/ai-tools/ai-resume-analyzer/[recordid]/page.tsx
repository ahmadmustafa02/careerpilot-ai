"use client"

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Report from '../_components/Report';

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

function AiResumeAnalyzer() {
  const params = useParams();
  const recordId = params.recordid; // Use lowercase to match your folder name [recordid]
  const [pdfUrl,setPdfUrl]=useState<string>();
  const [aiReport,setAiReport]= useState<AiReportType | null>(null);

  console.log("All params:", params);
  console.log("recordId extracted:", recordId);

  useEffect(()=>{
    console.log("useEffect triggered with recordId:", recordId);
    if (recordId) {
      console.log("Calling GetResumeAnalyzerRecord...");
      GetResumeAnalyzerRecord();
    } else {
      console.log("No recordId found");
    }
  },[recordId])

  const GetResumeAnalyzerRecord= async()=>{
    try {
      console.log("Fetching record for recordId:", recordId);
      const result = await axios.get('/api/history?recordId='+recordId)
      console.log("Full API response:", result);
      console.log("Response data:", result.data);
      console.log("Response status:", result.status);
      console.log("Content from DB:", result.data?.content);
      console.log("MetaData from DB:", result.data?.metaData);
      
      // Check if content exists and has the right structure
      if (result.data?.content) {
        console.log("Content exists, setting states...");
        console.log("Content structure:", JSON.stringify(result.data.content, null, 2));
        setPdfUrl(result.data?.metaData);
        setAiReport(result.data?.content);
      } else {
        console.log("No content found in response");
      }
      
    } catch (error) {
      console.error("Error fetching record:", error);
      // console.error("Error details:", error.response?.data);
    }
  }

  // Add this useEffect to debug state changes
  useEffect(() => {
    console.log("aiReport state changed:", aiReport);
    if (aiReport) {
      console.log("aiReport.overall_score:", aiReport.overall_score);
    }
  }, [aiReport]);

  return (
    <div className='max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen'>
      <div className='grid lg:grid-cols-2 grid-cols-1 gap-8'>
        {/* Left Column - AI Analysis */}
        <div className='space-y-6'>
          {!aiReport ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analysis...</p>
              </div>
            </div>
          ) : (
            <Report aiReport={aiReport}/>
          )}
        </div>
        
        {/* Right Column - Resume Preview */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h2 className='font-bold text-2xl mb-6 text-gray-800 flex items-center'>
            <i className="fas fa-file-pdf text-red-500 mr-3"></i>
            Resume Preview
          </h2>
          {pdfUrl ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-inner">
              <iframe
                src={pdfUrl+'#toolbar=0&navpanes=0&scrollbar=0'}
                width="100%"
                height="800"
                className='w-full'
                style={{ border: 'none' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <i className="fas fa-file-pdf text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">Loading PDF...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AiResumeAnalyzer