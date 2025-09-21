'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { cn } from "@/lib/utils"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  showSidebar?: boolean
}

export function MainLayout({ 
  children, 
  className,
  showSidebar = true 
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Mobile overlay */}
          {isMobile && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={toggleSidebar}
            />
          )}
          
          {/* Sidebar */}
          <div className={cn(
            "relative z-50",
            isMobile && sidebarCollapsed && "hidden"
          )}>
            <Sidebar 
              collapsed={sidebarCollapsed && !isMobile}
              onToggle={toggleSidebar}
            />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          showSidebarToggle={showSidebar && isMobile}
          onSidebarToggle={toggleSidebar}
        />

        {/* Page content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-muted/30",
          className
        )}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
