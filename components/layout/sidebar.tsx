'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  History,
  Upload,
  Shield,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Upload Document",
    href: "/dashboard?tab=upload",
    icon: Upload,
    badge: null,
  },
  {
    title: "Analysis Results",
    href: "/dashboard?tab=analysis",
    icon: FileText,
    badge: null,
  },
  {
    title: "AI Assistant",
    href: "/dashboard?tab=chat",
    icon: MessageSquare,
    badge: "New",
  },
  {
    title: "Risk Assessment",
    href: "/risk-assessment",
    icon: Shield,
    badge: null,
  },
  {
    title: "Document History",
    href: "/history",
    icon: History,
    badge: null,
  },
  {
    title: "Legal Glossary",
    href: "/glossary",
    icon: BookOpen,
    badge: null,
  },
]

const bottomItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
]

export function Sidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex h-screen flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">LegalEase</span>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href.includes('?tab=') && pathname === '/dashboard')
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  
                  {!collapsed && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="ml-3 truncate"
                      >
                        {item.title}
                      </motion.span>
                      
                      {item.badge && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto"
                        >
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-3">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="ml-3 truncate"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )
}
