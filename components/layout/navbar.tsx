"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Brain, FileText, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  showLinks?: boolean
  showButton?: boolean
  showHistory?: boolean
  onHistoryClick?: () => void
  isHistoryActive?: boolean
  onCtaClick?: () => void
  showSidebarToggle?: boolean
  onSidebarToggle?: () => void
}

const navigationLinks = [
  { name: "Analysis", href: "/analysis", icon: Brain },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Chat", href: "/chat", icon: MessageCircle },
]

export function Navbar({ 
  showLinks = true, 
  showButton = true, 
  showHistory = false,
  onHistoryClick,
  isHistoryActive = false,
  onCtaClick,
  showSidebarToggle = false,
  onSidebarToggle
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md border-border/50">
      <div className="container-linear">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-3">
            {showSidebarToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSidebarToggle}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">LE</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gradient-primary">
                LegalEase
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 lg:space-x-8 md:flex">
            {showLinks && (
              <div className="flex items-center space-x-4 lg:space-x-6">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 transition-colors text-muted-foreground hover:text-foreground group"
                  >
                    <link.icon className="w-4 h-4 transition-colors group-hover:text-primary" />
                    <span className="hidden lg:inline font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2 lg:space-x-4">
              {showHistory && (
                <Button
                  variant={isHistoryActive ? "default" : "outline"}
                  size="sm"
                  onClick={onHistoryClick}
                  className="flex items-center space-x-2"
                >
                  <span>📋</span>
                  <span className="hidden lg:inline">History</span>
                </Button>
              )}

              {showButton && (
                <Button 
                  onClick={onCtaClick}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-linear-lg"
                >
                  <span className="hidden lg:inline">Get Started</span>
                  <span className="lg:hidden">Start</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 border-b md:hidden top-16 bg-background/95 backdrop-blur-lg border-border/50 shadow-linear-xl"
          >
            <div className="py-4 px-4">
              <div className="space-y-2">
                {showLinks && navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center p-3 space-x-3 transition-colors rounded-lg hover:bg-muted/50 active:bg-muted/70"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}

                {showHistory && (
                  <Button
                    variant={isHistoryActive ? "default" : "outline"}
                    className="justify-start w-full space-x-2 mt-4"
                    onClick={() => {
                      onHistoryClick?.()
                      setIsMenuOpen(false)
                    }}
                  >
                    <span>📋</span>
                    <span>History</span>
                  </Button>
                )}

                {showButton && (
                  <Button 
                    onClick={() => {
                      onCtaClick?.()
                      setIsMenuOpen(false)
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 shadow-linear-lg"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
