import React from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface AnalysisResult {
  summary: string
  overall_risk_score: number
  risk_confidence: number
  document_type: string
  industry_context: string
  risk_breakdown: {
    financial_risk: number
    legal_risk: number
    operational_risk: number
    compliance_risk: number
    reputational_risk: number
  }
  key_findings: string[]
  recommendations: string[]
  critical_issues: Array<{
    issue: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    urgency: 'low' | 'medium' | 'high'
    impact: string
    recommendation: string
  }>
  financial_analysis?: {
    total_value?: string
    payment_terms?: string[]
    penalties?: Array<{
      trigger: string
      amount: string
      type: string
    }>
    liability_caps?: Array<{
      type: string
      amount: string
      scope: string
    }>
  }
  clauses: Array<{
    clause_id: string
    section: string
    text: string
    risk_level: 'low' | 'medium' | 'high'
    risk_score: number
    confidence: number
    risk_explanation: string
    clause_type?: string
    key_terms?: string[]
    recommendations?: string[]
    financial_impact?: {
      has_financial_terms: boolean
      amounts?: string[]
      percentages?: string[]
      impact_level: 'low' | 'medium' | 'high'
      note?: string
    }
  }>
  file_metadata: {
    filename: string
    file_type: string
    file_size: number
    extracted_text_length: number
    processing_timestamp: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatResponse {
  message: string
  conversation_id?: string
}

export interface DocumentTemplate {
  id: string
  title: string
  description: string
  category: string
  file_url: string
  preview_url?: string
  tags: string[]
  downloads: number
  rating: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Throw the full error response for better error handling
        if (errorData.error) {
          throw new Error(JSON.stringify(errorData))
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Document analysis APIs
  async analyzeText(text: string): Promise<AnalysisResult> {
    return this.request<AnalysisResult>('/api/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  }

  async analyzeDocument(file: File): Promise<AnalysisResult> {
    const formData = new FormData()
    formData.append('file', file)
    
    // Create AbortController for timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minutes timeout
    
    try {
      // Use fetch directly for file uploads to avoid JSON headers
      const response = await fetch(`${this.baseUrl}/api/analyze-document`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Don't set Content-Type header - let browser set it with boundary
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Upload failed' } }))
        // Throw the full error response for better error handling
        if (errorData.error) {
          throw new Error(JSON.stringify(errorData))
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - document processing is taking longer than expected. Please try again.')
      }
      throw error
    }
  }

  // Chat APIs
  async sendChatMessage(
    message: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    })
  }

  async getChatHistory(conversationId: string): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/api/chat/history/${conversationId}`)
  }

  // Template APIs
  async getTemplates(category?: string): Promise<DocumentTemplate[]> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    return this.request<DocumentTemplate[]>(`/api/templates?${params}`)
  }

  async downloadTemplate(templateId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/templates/${templateId}`)
    if (!response.ok) {
      throw new Error(`Failed to download template: ${response.statusText}`)
    }
    return response.blob()
  }

  async searchTemplates(query: string): Promise<DocumentTemplate[]> {
    return this.request<DocumentTemplate[]>('/api/templates/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/api/health')
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Utility functions for error handling
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message.includes('fetch')
}

// React hooks for API calls
export const useApiCall = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const execute = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  return { data, loading, error, execute }
}