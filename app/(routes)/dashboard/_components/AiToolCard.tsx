"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import ResumeUploadDialog from './ResumeUploadDialog';
import RoadmapGeneratorDialog from './RoadmapGeneratorDialog';

interface TOOL {
    name: string,
    desc: string,
    icon: string,
    button: string,
    path: string
}

type AIToolProps = {
    tool: TOOL
}

function AiToolCard({ tool }: AIToolProps) {
    const id = uuidv4();
    const { user } = useUser();
    const router = useRouter();
    
    const [openResumeUpload, setOpenResumeUpload] = useState(false);
    const [openRoadmapDialog, setRoadmapDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getGradientColors = (toolName: string) => {
        switch(toolName) {
            case 'AI Career Q&A Chat':
                return 'from-blue-500 to-cyan-500';
            case 'AI Resume Analyzer':
                return 'from-purple-500 to-pink-500';
            case 'Career Roadmap Generator':
                return 'from-indigo-500 to-blue-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const onClickButton = async () => {
        setIsLoading(true);
        
        if (tool.name === 'AI Resume Analyzer') {
            setOpenResumeUpload(true);
            setIsLoading(false);
            return;
        }
        
        if (tool.path === '/ai-tools/ai-roadmap-agent') {
            setRoadmapDialog(true);
            setIsLoading(false);
            return;
        }
        
        try {
            const result = await axios.post('/api/history', {
                recordId: id,
                content: []
            });
            console.log(result);
            router.push(tool.path + "/" + id);
        } catch (error) {
            console.error('Error creating history record:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:border-gray-600">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 dark:from-blue-900/10 dark:to-purple-900/10"></div>
            
            <div className="relative">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${getGradientColors(tool.name)} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Image 
                        src={tool.icon} 
                        width={28} 
                        height={28} 
                        alt={tool.name}
                        className="filter brightness-0 invert"
                    />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {tool.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {tool.desc}
                </p>
                
                <Button 
                    className={`w-full bg-gradient-to-r ${getGradientColors(tool.name)} hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] text-white border-0`}
                    onClick={onClickButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Loading...
                        </div>
                    ) : (
                        <>
                            {tool.button}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </>
                    )}
                </Button>
            </div>
            
            <ResumeUploadDialog 
                openResumeUpload={openResumeUpload} 
                setOpenResumeDialog={setOpenResumeUpload} 
                recordId={id} 
            />
            <RoadmapGeneratorDialog
                openDialog={openRoadmapDialog}
                setOpenDialog={() => setRoadmapDialog(false)}
            />
        </div>
    )
}

export default AiToolCard