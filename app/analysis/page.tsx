"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  FileText, 
  Eye, 
  Download,
  Shield,
  Sparkles,
  ArrowRight,
  File,
  FileImage,
  FileSpreadsheet,
  Brain,
  AlertTriangle,
  X,
  TrendingUp,
  Scale,
  DollarSign,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
// Removed unused Progress import
import { CircularRiskMeter } from '@/components/ui/circular-risk-meter'
import { ScanLoader } from '@/components/ui/scan-loader'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/layout/navbar"
import { apiClient, handleApiError, type AnalysisResult } from '@/lib/api-client'
import { useRouter } from 'next/navigation'

// Removed unused AnalysisStep interface

export default function AnalysisPage() {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [textInput, setTextInput] = React.useState('')
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  // Removed unused progress state
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (fileType.includes('word') || fileType.includes('document')) return <File className="w-8 h-8 text-blue-500" />
    if (fileType.includes('image')) return <FileImage className="w-8 h-8 text-green-500" />
    if (fileType.includes('sheet')) return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
    return <FileText className="w-8 h-8 text-slate-500" />
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ]
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, Word document, text file, or image (JPEG, PNG, TIFF).')
      return
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.')
      return
    }

    setFile(selectedFile)
    setTextInput('')
    setError(null)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  // Removed unused step simulation

  const handleAnalysis = async () => {
    if (!file && !textInput.trim()) {
      setError('Please upload a file or enter text to analyze.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)
    
    // Removed step simulation

    try {
      let result: AnalysisResult
      if (file) {
        console.log('Analyzing document:', file.name, file.type, file.size)
        result = await apiClient.analyzeDocument(file)
        console.log('Document analysis result:', result)
      } else {
        console.log('Analyzing text:', textInput.substring(0, 100) + '...')
        result = await apiClient.analyzeText(textInput)
        console.log('Text analysis result:', result)
      }
      
      // Validate result
      if (!result || !result.overall_risk_score) {
        throw new Error('Invalid analysis result received')
      }
      
      // Analysis completed
      console.log('Analysis completed successfully:', {
        riskScore: result.overall_risk_score,
        clauses: result.clauses?.length || 0,
        criticalIssues: result.critical_issues?.length || 0
      })
      
      setTimeout(() => {
        setAnalysisResult(result)
        setIsAnalyzing(false)
        // Store analysis result in localStorage for dashboard access
        localStorage.setItem('analysisResult', JSON.stringify(result))
        
        // Auto-redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/analysis/dashboard')
        }, 2000)
      }, 1000)

    } catch (err) {
      // Analysis failed
      console.error('Analysis error:', err)
      setError(handleApiError(err))
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setTextInput('')
    setAnalysisResult(null)
    setError(null)
    setIsAnalyzing(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-500'
    if (score >= 4) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'critical': return 'bg-red-600/30 text-red-300 border-red-600/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <Navbar />
    
    <div className="container mx-auto px-4 py-12 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6"
          >
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">AI-Powered Legal Analysis</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
            Document Analysis Suite
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Upload your legal documents for comprehensive AI-powered risk assessment, 
            clause analysis, and actionable recommendations
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-red-200 font-medium">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {!isAnalyzing && !analysisResult && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                      <Upload className="w-5 h-5 text-blue-400" />
                    </div>
                    Document Upload
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Upload your legal document or paste text directly for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-white/10">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="text" className="data-[state=active]:bg-white/10">
                        <FileText className="w-4 h-4 mr-2" />
                        Paste Text
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="mt-6">
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                          isDragOver 
                            ? 'border-blue-400/60 bg-blue-500/10' 
                            : file 
                              ? 'border-green-400/60 bg-green-500/10' 
                              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {file ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center justify-center">
                              {getFileIcon(file.type)}
                            </div>
                            <div>
                              <p className="text-white font-medium mb-1">{file.name}</p>
                              <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setFile(null)
                              }}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </motion.div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                                <Upload className="w-8 h-8 text-blue-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-white font-medium mb-2">
                                Drop your document here or click to browse
                              </p>
                              <p className="text-slate-400 text-sm mb-4">
                                Upload PDF, Word documents, text files, or images (JPG, PNG, GIF, BMP, WebP, TIFF) for comprehensive legal analysis with OCR support
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="text" className="mt-6">
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Paste your legal text here for analysis..."
                          value={textInput}
                          onChange={(e) => {
                            setTextInput(e.target.value)
                            if (e.target.value) setFile(null)
                          }}
                          className="min-h-[300px] bg-white/5 border-white/10 text-white placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                        />
                        <div className="flex justify-between items-center text-sm text-slate-400">
                          <span>{textInput.length} characters</span>
                          <span>Minimum 50 characters recommended</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    onClick={handleAnalysis}
                    disabled={!file && !textInput.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white font-medium py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start AI Analysis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Analysis Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: TrendingUp, title: "Risk Assessment", desc: "Multi-dimensional risk scoring" },
                    { icon: Scale, title: "Legal Compliance", desc: "Regulatory requirement checks" },
                    { icon: DollarSign, title: "Financial Impact", desc: "Cost and liability analysis" },
                    { icon: Users, title: "Stakeholder Analysis", desc: "Party obligations review" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                          <feature.icon className="w-4 h-4 text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{feature.title}</p>
                        <p className="text-slate-400 text-xs">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Analysis Time</span>
                    <span className="text-white font-medium">~30-60s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Accuracy Rate</span>
                    <span className="text-emerald-400 font-medium">95%+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Risk Categories</span>
                    <span className="text-white font-medium">8+</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <ScanLoader text="Analyzing" size="lg" />
          </div>
        )}

        {/* Success Message */}
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 backdrop-blur-xl">
              <CardContent className="py-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="flex justify-center mb-6">
                  <CircularRiskMeter
                    riskScore={analysisResult.overall_risk_score}
                    confidence={analysisResult.risk_confidence || 75}
                    size="md"
                    showLabel={true}
                    animated={true}
                    interactive={true}
                    showDetails={true}
                    riskBreakdown={analysisResult.risk_breakdown}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Analysis Complete!</h3>
                <p className="text-slate-300 mb-6">
                  Your document has been successfully analyzed with a risk score of {analysisResult.overall_risk_score}/100
                </p>
                <div className="text-left max-w-md mx-auto mb-6 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Quick Summary:</h4>
                  <p className="text-slate-300 text-sm mb-2">{analysisResult.summary}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">Document Type:</span>
                    <Badge variant="outline">{analysisResult.document_type}</Badge>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => router.push('/analysis/dashboard')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Analyze Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  </div>
  )
}
