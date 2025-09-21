"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, Bot, User, Sparkles, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { apiClient, handleApiError, type ChatResponse } from '@/lib/api-client'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  message: string
  timestamp: string
}

interface ExtendedChatMessage extends ChatMessage {
  isLoading?: boolean
}

const suggestedQuestions = [
  "What should I look for in a non-disclosure agreement?",
  "How can I protect my intellectual property?",
  "What are the key terms in an employment contract?",
  "When do I need a lawyer for contract review?",
  "What's the difference between a contractor and employee?",
  "How do I terminate a business partnership?"
]


export default function ChatPage() {
  const [messages, setMessages] = React.useState<ExtendedChatMessage[]>([])
  const [inputMessage, setInputMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isTyping, setIsTyping] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [conversationId, setConversationId] = React.useState<string>('')
  const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    // Generate conversation ID on mount
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    
    // Add welcome message
    const welcomeMessage: ExtendedChatMessage = {
      id: 'welcome',
      role: 'assistant',
      message: "Hello! I'm your AI legal assistant. I can help you analyze contracts, understand legal terms, assess risks, and provide guidance on legal documents. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ExtendedChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    const loadingMessage: ExtendedChatMessage = {
      id: `loading_${Date.now()}`,
      role: 'assistant',
      message: '',
      timestamp: new Date().toISOString(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      const response: ChatResponse = await apiClient.sendChatMessage(
        inputMessage.trim(),
        conversationId
      )

      // Remove loading message and add actual response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading)
        const assistantMessage: ExtendedChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          message: response.message,
          timestamp: new Date().toISOString()
        }
        return [...withoutLoading, assistantMessage]
      })

      // Update conversation ID if provided
      if (response.conversation_id) {
        setConversationId(response.conversation_id)
      }

    } catch (err) {
      // Remove loading message and show error
      setMessages(prev => prev.filter(msg => !msg.isLoading))
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    const welcomeMessage: ExtendedChatMessage = {
      id: 'welcome_new',
      role: 'assistant',
      message: "Hello! I'm your AI legal assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    setError(null)
  }

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden sm:py-32">
        <div className="container-linear">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 text-primary">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                AI Legal{" "}
                <span className="text-gradient-primary">Assistant</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Get instant answers to your legal questions from our AI-powered assistant. Available 24/7 to help with contracts, compliance, and legal guidance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-16">
        <div className="container-linear">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="space-y-6 lg:col-span-1">
                {/* Suggested Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suggested Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="justify-start w-full h-auto p-3 text-left text-wrap"
                        onClick={() => handleSuggestedQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col shadow-linear-xl">
                  <CardHeader className="border-b border-border/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Legal AI Assistant</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <CardDescription>Online and ready to help</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4" ref={messagesEndRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                              <p className="text-sm">{message.message}</p>
                              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex items-start space-x-3 max-w-[80%]">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="p-3 rounded-lg bg-muted">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex space-x-2">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Press Enter to send • This AI provides general information and should not replace professional legal advice
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted/30">
        <div className="container-linear">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">Important Notice</Badge>
            <p className="text-sm text-muted-foreground">
              This AI assistant provides general legal information and guidance. It should not be considered as professional legal advice. 
              For specific legal matters, please consult with a qualified attorney in your jurisdiction.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
