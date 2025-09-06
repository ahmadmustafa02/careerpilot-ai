import React from 'react'

const questionList = [
    {
        question: 'What skills do I need for a full-stack developer role?',
        icon: '💻',
        category: 'Technical Skills'
    },
    {
        question: 'How do I switch careers to AI/ML?',
        icon: '🤖',
        category: 'Career Transition'
    },
    {
        question: 'How to negotiate salary effectively?',
        icon: '💰',
        category: 'Compensation'
    },
    {
        question: 'What are the best remote work opportunities?',
        icon: '🏠',
        category: 'Remote Work'
    }
]

function EmptyState({ selectedQuestion }: any) {
    return (
    <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[600px] p-4 sm:p-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                Ask Anything to Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Career Agent
                </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
                Get personalized career guidance, industry insights, and expert advice to accelerate your professional journey
            </p>
        </div>

        {/* Quick Start Questions */}
        <div className="w-full max-w-4xl px-2 sm:px-0">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Popular Questions to Get Started
                </h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-2">
                    Click on any question below or type your own
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {questionList.map((item, index) => (
                    <div
                        key={index}
                        className="group relative bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:border-blue-500"
                        onClick={() => selectedQuestion(item.question)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 dark:from-blue-900/10 dark:to-purple-900/10"></div>
                        
                        <div className="relative">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200">
                                    {item.icon}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1 sm:mb-2">
                                        {item.category}
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium leading-relaxed group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                        {item.question}
                                    </p>
                                </div>
                                
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Question Input Hint */}
            <div className="mt-8 sm:mt-12 text-center px-2">
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 dark:bg-gray-800/50 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-center">Or type your own question in the chat box below</span>
                </div>
            </div>
        </div>
    </div>
)
}

export default EmptyState