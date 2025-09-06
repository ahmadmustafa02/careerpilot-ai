import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import AiTools from './_components/AiTools'
import History from '@/app/(routes)/dashboard/_components/History'

function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-6">
            <div className="max-w-7xl mx-auto">
                <WelcomeBanner />
                <AiTools /> 
                <History />
            </div>
        </div>
    )
}

export default Dashboard