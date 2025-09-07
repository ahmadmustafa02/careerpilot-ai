// History.tsx
"use client"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { aiToolsList } from './AiTools';
import Link from 'next/link';

function History() {
    const [userHistory, setUserHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        GetHistory();
    }, [])

    const GetHistory = async () => {
        try {
            const result = await axios.get('/api/history');
            console.log(result.data)
            setUserHistory(result.data)
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const GetAgentName = (path: string) => {
        const agent = aiToolsList.find(item => item.path === path);
        return agent;
    }

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

   return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
        <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Previous History
                </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg px-1">
                Access your previous work and continue where you left off
            </p>
        </div>

        {isLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        ) : userHistory?.length === 0 ? (
            <div className="flex items-center justify-center flex-col py-12 sm:py-16 px-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <Image src="/idea.png" alt="No history" width={40} height={40} className="sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                    No History Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-center max-w-md">
                    Start using our AI tools to build your career history and track your progress
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Explore AI Tools
                </Button>
            </div>
        ) : (
               <div className="grid gap-3 sm:gap-4 w-full">                {userHistory?.map((history: any, index: number) => {
                    const agent = GetAgentName(history?.aiAgentType);
                    return (
                        <Link href={history?.aiAgentType + "/" + history?.recordId} key={index}>
                            <div className="group p-2 sm:p-6 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer dark:bg-gray-800/60 dark:border-gray-600 dark:hover:border-blue-500 overflow-hidden w-full max-w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                        {agent && (
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getGradientColors(agent.name)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                                                <Image 
                                                    src={agent.icon} 
                                                    width={20} 
                                                    height={20} 
                                                    alt={agent.name}
                                                    className="filter brightness-0 invert sm:w-6 sm:h-6"
                                                />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                {agent?.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(history?.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        )}
    </div>
)
}

export default History