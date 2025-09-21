'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  DollarSign,
  Scale,
  Users,
  Clock,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CircularRiskMeter } from '@/components/ui/circular-risk-meter'
import { MultiLanguageSummary } from '@/components/ui/multi-language-summary'
import { type AnalysisResult } from '@/lib/api-client'

interface EnhancedAnalysisResultsProps {
  result: AnalysisResult
  className?: string
}

export function EnhancedAnalysisResults({ result, className = '' }: EnhancedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low': return <Shield className="w-4 h-4 text-green-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Risk Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Analysis Complete</h2>
        <div className="flex justify-center">
          <CircularRiskMeter
            riskScore={result.overall_risk_score}
            confidence={result.risk_confidence}
            size="lg"
            interactive={true}
            showDetails={true}
            riskBreakdown={result.risk_breakdown}
            animated={true}
          />
        </div>
        
        {/* Clean Analysis Summary */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-full border border-white/10">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{result.risk_confidence}%</div>
              <div className="text-xs text-slate-400">CONFIDENCE</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{result.clauses?.length || 0}</div>
              <div className="text-xs text-slate-400">CLAUSES</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400">{result.critical_issues?.length || 0}</div>
              <div className="text-xs text-slate-400">ISSUES</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Multi-Language Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MultiLanguageSummary
          summary={result.summary}
          title="Document Analysis Summary"
        />
      </motion.div>

      {/* Detailed Analysis Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="risks" className="data-[state=active]:bg-white/10">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risks
            </TabsTrigger>
            <TabsTrigger value="clauses" className="data-[state=active]:bg-white/10">
              <FileText className="w-4 h-4 mr-2" />
              Clauses
            </TabsTrigger>
            <TabsTrigger value="metadata" className="data-[state=active]:bg-white/10">
              <FileText className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-4">
            {/* Key Findings */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Key Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.key_findings.map((finding, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{finding}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="mt-6 space-y-4">
            {/* Critical Issues */}
            {result.critical_issues && result.critical_issues.length > 0 && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Critical Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.critical_issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(issue.severity)}
                            <h4 className="font-semibold text-white">{issue.issue}</h4>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getRiskColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {issue.urgency} urgency
                            </Badge>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{issue.impact}</p>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-blue-300 text-sm font-medium">Recommendation:</p>
                          <p className="text-blue-200 text-sm mt-1">{issue.recommendation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Breakdown */}
            {result.risk_breakdown && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    Risk Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result.risk_breakdown).map(([key, value]) => {
                      if (!value) return null
                      const percentage = (value / 10) * 100
                      const color = percentage > 70 ? '#ef4444' : percentage > 40 ? '#f59e0b' : '#10b981'
                      const label = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      const icon = key.includes('financial') ? DollarSign :
                                  key.includes('legal') ? Scale :
                                  key.includes('operational') ? Users :
                                  key.includes('compliance') ? Shield : FileText
                      
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Object.keys(result.risk_breakdown).indexOf(key) * 0.1 }}
                          className="p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {React.createElement(icon, { className: "w-4 h-4", style: { color } })}
                              <span className="text-white font-medium">{label}</span>
                            </div>
                            <span className="font-bold" style={{ color }}>{Math.round(percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{ backgroundColor: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="clauses" className="mt-6">
            {result.clauses && result.clauses.length > 0 ? (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Detailed Clause Analysis ({result.clauses.length} clauses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {result.clauses.map((clause, index) => (
                      <motion.div
                        key={clause.clause_id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        {/* Clause Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg mb-1">
                              {clause.section || `Clause ${index + 1}`}
                            </h4>
                            {clause.clause_type && (
                              <Badge variant="outline" className="text-xs mb-2">
                                {clause.clause_type}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getRiskColor(clause.risk_level)}>
                              {clause.risk_level} risk
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {clause.confidence}% confidence
                            </Badge>
                          </div>
                        </div>

                        {/* Clause Text */}
                        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-slate-300 text-sm leading-relaxed italic">
                            "{clause.text}"
                          </p>
                        </div>

                        {/* Key Terms */}
                        {clause.key_terms && clause.key_terms.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-slate-400 mb-2">Key Terms:</h5>
                            <div className="flex flex-wrap gap-2">
                              {clause.key_terms.map((term, termIndex) => (
                                <Badge key={termIndex} variant="secondary" className="text-xs">
                                  {term}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Financial Impact */}
                        {clause.financial_impact?.has_financial_terms && (
                          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <h5 className="text-sm font-medium text-green-300 mb-2 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Financial Impact: {clause.financial_impact.impact_level}
                            </h5>
                            {clause.financial_impact.amounts && clause.financial_impact.amounts.length > 0 && (
                              <p className="text-green-200 text-sm">
                                Amounts: {clause.financial_impact.amounts.join(', ')}
                              </p>
                            )}
                            {clause.financial_impact.percentages && clause.financial_impact.percentages.length > 0 && (
                              <p className="text-green-200 text-sm">
                                Rates: {clause.financial_impact.percentages.join(', ')}
                              </p>
                            )}
                            {clause.financial_impact.note && (
                              <p className="text-green-200 text-sm mt-1">{clause.financial_impact.note}</p>
                            )}
                          </div>
                        )}

                        {/* Risk Explanation */}
                        {clause.risk_explanation && (
                          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <h5 className="text-sm font-medium text-yellow-300 mb-1">Risk Analysis:</h5>
                            <p className="text-yellow-200 text-sm">{clause.risk_explanation}</p>
                          </div>
                        )}

                        {/* Recommendations */}
                        {clause.recommendations && clause.recommendations.length > 0 && (
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <h5 className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Recommendations:
                            </h5>
                            <ul className="space-y-1">
                              {clause.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="text-blue-200 text-sm flex items-start gap-2">
                                  <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">No specific clauses identified in this analysis.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Document Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-400 text-sm">Document Type</label>
                      <p className="text-white font-medium">{result.document_type}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Industry Context</label>
                      <p className="text-white font-medium">{result.industry_context}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Risk Confidence</label>
                      <p className="text-white font-medium">{result.risk_confidence}%</p>
                    </div>
                  </div>
                  {result.file_metadata && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-sm">File Name</label>
                        <p className="text-white font-medium">{result.file_metadata.filename}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">File Size</label>
                        <p className="text-white font-medium">{(result.file_metadata.file_size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Processing Time</label>
                        <p className="text-white font-medium">
                          {new Date(result.file_metadata.processing_timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-4"
      >
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Analysis
        </Button>
      </motion.div>
    </div>
  )
}
