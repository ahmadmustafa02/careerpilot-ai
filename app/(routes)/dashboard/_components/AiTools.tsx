import AiToolCard from '@/app/(routes)/dashboard/_components/AiToolCard'
import React from 'react'

export const aiToolsList = [
    {
        name: 'AI Career Q&A Chat',
        desc: 'Get personalized career guidance and ask any career-related questions',
        icon: '/chatbot.png',
        button: 'Let\'s Chat',
        path: '/ai-tools/ai-chat',
    },
    {
        name: 'AI Resume Analyzer',
        desc: 'Get detailed feedback and optimize your resume for better results',
        icon: '/resume.png',
        button: 'Analyze Now',
        path: '/ai-tools/ai-resume-analyzer',
    },
    {
        name: 'Career Roadmap Generator',
        desc: 'Create personalized learning paths for your career goals',
        icon: '/roadmap.png',
        button: 'Generate Now',
        path: '/ai-tools/ai-roadmap-agent',
    },
]

function AiTools() {
    return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700 mb-6 sm:mb-8">
        <div className="mb-6 sm:mb-8 ">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md sm:rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Available AI Tools
                </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg px-1">
                Start building and shaping your career with these powerful AI-driven tools
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {aiToolsList.map((tool, index) => (
                <AiToolCard key={index} tool={tool} />
            ))}
        </div>
    </div>
)
}

export default AiTools