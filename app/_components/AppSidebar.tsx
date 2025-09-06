import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { Calendar, Layers, UserCircle } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Workspace",
        url: "/dashboard",
        icon: Layers,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "My History",
        url: "/my-history",
        icon: Calendar,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
        gradient: "from-indigo-500 to-blue-500"
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar className="border-r border-gray-200/50 bg-white/80 backdrop-blur-lg dark:bg-gray-900/80 dark:border-gray-700/50">
            <SidebarHeader className="p-6">
                <div className="text-center">
                    <div className="relative mx-auto w-32 h-16 mb-3">
                        <Image 
                            src="/logo.png" 
                            alt="AI Career Tools" 
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Build Awesome Skills
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {items.map((item, index) => {
                                const isActive = path.includes(item.url);
                                return (
                                    <a 
                                        href={item.url} 
                                        key={index} 
                                        className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            isActive 
                                                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                                                : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{item.title}</span>
                                        {isActive && (
                                            <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </a>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>LinkedIn/ahmadmustafa01</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
