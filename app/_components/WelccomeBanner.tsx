// WelcomeBanner.tsx (Create this component)
import React from 'react'
import { useUser } from '@clerk/nextjs'

function WelcomeBanner() {
    const { user } = useUser();
    
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back, {user?.firstName || 'there'}! 👋
                        </h1>
                        <p className="text-blue-100 text-lg mb-4">
                            Ready to accelerate your career journey today?
                        </p>
                        <div className="flex items-center gap-2 text-sm text-blue-100">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>All systems operational</span>
                        </div>
                    </div>
                    
                    <div className="hidden md:block">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeBanner