'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedAnalysisResults } from '@/components/analysis/enhanced-analysis-results'
import { type AnalysisResult } from '@/lib/api-client'

export default function AnalysisDashboard() {
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        // Try to get most recent analysis from localStorage
        const storedData = localStorage.getItem('analysisResult')
        if (storedData) {
          try {
            const data = JSON.parse(storedData)
            setAnalysisData(data)
          } catch (parseError) {
            console.error('Error parsing stored analysis data:', parseError)
            setError('Invalid analysis data found')
          }
        } else {
          setError('No analysis data found. Please run an analysis first.')
        }
      } catch (err) {
        console.error('Error loading analysis data:', err)
        setError('Failed to load analysis data')
      } finally {
        setLoading(false)
      }
    }

    loadAnalysisData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 text-red-400 mx-auto mb-4">❌</div>
          <h2 className="text-xl font-semibold text-white mb-2">Analysis Not Found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Button 
            onClick={() => router.push('/analysis')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analysis
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/analysis')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Enhanced Analysis Results */}
        <EnhancedAnalysisResults result={analysisData} />
      </div>
    </div>
  )
}
