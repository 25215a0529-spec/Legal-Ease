'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Badge } from './badge'

interface CircularRiskMeterProps {
  riskScore: number
  confidence?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
  className?: string
  interactive?: boolean
  showDetails?: boolean
  riskBreakdown?: {
    financial_risk?: number
    legal_risk?: number
    operational_risk?: number
    compliance_risk?: number
    reputational_risk?: number
  }
  onRiskClick?: () => void
}

export function CircularRiskMeter({
  riskScore,
  confidence = 100,
  size = 'md',
  showLabel = true,
  animated = true,
  className = '',
  interactive = false,
  showDetails = false,
  riskBreakdown,
  onRiskClick
}: CircularRiskMeterProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  // Risk score is already on 0-100 scale
  const normalizedScore = Math.max(0, Math.min(100, riskScore))
  
  // Calculate stroke dash array for the progress circle
  const radius = size === 'sm' ? 35 : size === 'md' ? 45 : 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference
  
  // Determine risk level and colors (now based on percentage)
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Low', color: '#10b981', bgColor: '#dcfce7' }
    if (score <= 60) return { level: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' }
    if (score <= 80) return { level: 'High', color: '#ef4444', bgColor: '#fee2e2' }
    return { level: 'Critical', color: '#dc2626', bgColor: '#fecaca' }
  }
  
  const riskInfo = getRiskLevel(riskScore)
  
  // Size configurations
  const sizeConfig = {
    sm: {
      width: 100,
      height: 100,
      strokeWidth: 6,
      fontSize: 'text-sm',
      labelSize: 'text-xs'
    },
    md: {
      width: 140,
      height: 140,
      strokeWidth: 8,
      fontSize: 'text-lg',
      labelSize: 'text-sm'
    },
    lg: {
      width: 180,
      height: 180,
      strokeWidth: 10,
      fontSize: 'text-2xl',
      labelSize: 'text-base'
    }
  }
  
  const config = sizeConfig[size]
  
  // Get risk trend indicator
  const getRiskTrend = () => {
    if (riskScore <= 30) return { icon: Shield, color: 'text-green-500', text: 'Low Risk' }
    if (riskScore <= 60) return { icon: TrendingUp, color: 'text-yellow-500', text: 'Moderate Risk' }
    if (riskScore <= 80) return { icon: AlertTriangle, color: 'text-orange-500', text: 'High Risk' }
    return { icon: AlertTriangle, color: 'text-red-500', text: 'Critical Risk' }
  }

  const trendInfo = getRiskTrend()

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`relative ${interactive ? 'cursor-pointer' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (interactive && onRiskClick) onRiskClick()
          if (showDetails) setShowBreakdown(!showBreakdown)
        }}
      >
        <svg
          width={config.width}
          height={config.height}
          className={`transform -rotate-90 transition-all duration-300 ${isHovered && interactive ? 'scale-105' : ''}`}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={radius}
            stroke={riskInfo.color}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? circumference : strokeDashoffset}
            animate={animated ? { strokeDashoffset } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${riskInfo.color}40)`
            }}
          />
          
          {/* Confidence indicator (inner circle) */}
          {confidence < 100 && (
            <motion.circle
              cx={config.width / 2}
              cy={config.height / 2}
              r={radius - 15}
              stroke="#9ca3af"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * (radius - 15)}
              strokeDashoffset={2 * Math.PI * (radius - 15) - ((confidence / 100) * 2 * Math.PI * (radius - 15))}
              animate={animated ? { 
                strokeDashoffset: 2 * Math.PI * (radius - 15) - ((confidence / 100) * 2 * Math.PI * (radius - 15))
              } : {}}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              opacity={0.6}
            />
          )}
        </svg>
        
        {/* Clean Risk Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={animated ? { scale: 0 } : { scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            {/* Main Risk Score */}
            <div className={`font-bold ${size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-xl' : 'text-3xl'}`} style={{ color: riskInfo.color }}>
              {normalizedScore}
            </div>
            
            {/* Simple Label - only show if explicitly requested */}
            {showLabel && size === 'lg' && (
              <div className="text-xs text-slate-400 mt-1 font-medium">
                RISK SCORE
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Clean Risk Level Badge - only for large size */}
        {size === 'lg' && showDetails && (
          <motion.div
            initial={animated ? { scale: 0, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${riskInfo.color}20`, 
                color: riskInfo.color,
                border: `1px solid ${riskInfo.color}30`
              }}
            >
              {riskInfo.level.toUpperCase()}
            </div>
          </motion.div>
        )}

        {/* Clean Interactive Button */}
        {interactive && size === 'lg' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            className="absolute -top-1 -right-1"
          >
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200"
            >
              <Info className="w-3 h-3 text-white/70" />
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Clean External Info - only for small/medium sizes */}
      {showLabel && size !== 'lg' && confidence && (
        <motion.div
          initial={animated ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-3 text-center"
        >
          <div className="text-xs text-slate-400 font-medium">
            {confidence}% CONFIDENCE
          </div>
        </motion.div>
      )}

      {/* Risk Breakdown Modal */}
      {showBreakdown && riskBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-4 w-full max-w-sm"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Risk Breakdown</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreakdown(false)}
                  className="w-6 h-6 p-0"
                >
                  <EyeOff className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(riskBreakdown).map(([key, value]) => {
                  if (!value) return null
                  const percentage = (value / 10) * 100
                  const color = percentage > 70 ? '#ef4444' : percentage > 40 ? '#f59e0b' : '#10b981'
                  const label = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-medium" style={{ color }}>{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Confidence</span>
                  <Badge variant="outline" className="text-xs">
                    {confidence}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Risk breakdown component for detailed view
interface RiskBreakdownProps {
  riskBreakdown: {
    financial_risk?: number
    legal_risk?: number
    operational_risk?: number
    compliance_risk?: number
    reputational_risk?: number
  }
  animated?: boolean
}

export function RiskBreakdown({ riskBreakdown, animated = true }: RiskBreakdownProps) {
  const riskCategories = [
    { key: 'financial_risk', label: 'Financial', icon: '💰' },
    { key: 'legal_risk', label: 'Legal', icon: '⚖️' },
    { key: 'operational_risk', label: 'Operational', icon: '⚙️' },
    { key: 'compliance_risk', label: 'Compliance', icon: '📋' },
    { key: 'reputational_risk', label: 'Reputational', icon: '🏢' }
  ]

  const getRiskColor = (score: number) => {
    // Convert 1-10 scale to percentage for display
    const percentage = (score / 10) * 100
    if (percentage <= 30) return '#10b981'
    if (percentage <= 60) return '#f59e0b'
    if (percentage <= 80) return '#ef4444'
    return '#dc2626'
  }

  return (
    <div className="space-y-3">
      {riskCategories.map((category, index) => {
        const score = riskBreakdown[category.key as keyof typeof riskBreakdown] || 0
        const color = getRiskColor(score)
        
        return (
          <motion.div
            key={category.key}
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <span className="text-lg">{category.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {category.label}
                </span>
                <span className="text-sm font-bold" style={{ color }}>
                  {Math.round((score / 10) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={animated ? { width: 0 } : { width: `${(score / 10) * 100}%` }}
                  animate={{ width: `${(score / 10) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
