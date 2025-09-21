// Enhanced Analysis Engine for LegalEase
export interface AdvancedAnalysisResult {
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
  clauses: Array<{
    clause_id: string
    section: string
    text: string
    risk_level: 'low' | 'medium' | 'high'
    risk_score: number
    confidence: number
    risk_explanation: string
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
  file_metadata: {
    filename: string
    file_type: string
    file_size: number
    extracted_text_length: number
    processing_timestamp: string
  }
}

// Advanced pattern recognition for legal documents
export class LegalAnalysisEngine {
  private static readonly RISK_PATTERNS = {
    CRITICAL: {
      unlimited_liability: /unlimited\s+liability|without\s+limitation|no\s+cap|unlimited\s+damages/gi,
      personal_guarantee: /personal\s+guarantee|personally\s+liable|individual\s+liability/gi,
      criminal_liability: /criminal\s+liability|criminal\s+penalties|felony|misdemeanor/gi,
      immediate_termination: /immediate\s+termination|terminate\s+immediately|without\s+notice/gi
    },
    HIGH: {
      litigation: /litigation|lawsuit|legal\s+action|court\s+proceedings|arbitration/gi,
      indemnification: /indemnif|hold\s+harmless|defend\s+and\s+hold/gi,
      liquidated_damages: /liquidated\s+damages|penalty\s+clause|punitive\s+damages/gi,
      non_compete: /non.?compete|restraint\s+of\s+trade|exclusive\s+dealing/gi,
      force_majeure: /force\s+majeure|act\s+of\s+god|unforeseeable/gi
    },
    MEDIUM: {
      auto_renewal: /auto.?renew|automatic.?renewal|evergreen\s+clause/gi,
      governing_law: /governing\s+law|jurisdiction|venue|forum/gi,
      confidentiality: /confidential|non.?disclosure|proprietary\s+information/gi,
      assignment: /assignment|transfer|delegate/gi
    },
    LOW: {
      standard_terms: /standard\s+terms|boilerplate|entire\s+agreement/gi,
      notices: /notice|notification|written\s+notice/gi
    }
  }

  private static readonly FINANCIAL_PATTERNS = {
    amounts: /\$[\d,]+(?:\.\d{2})?|\d+\s*(?:million|billion|thousand)|USD\s*\d+/gi,
    payment_terms: /payment\s+terms|due\s+date|net\s+\d+|payment\s+schedule/gi,
    interest_rates: /interest\s+rate|\d+%\s*per\s*annum|APR/gi,
    late_fees: /late\s+fee|penalty\s+rate|default\s+interest/gi
  }

  private static readonly INDUSTRY_INDICATORS = {
    technology: /software|SaaS|API|cloud|data|technology|IT|digital/gi,
    healthcare: /medical|healthcare|HIPAA|patient|clinical|pharmaceutical/gi,
    finance: /financial|banking|investment|securities|credit|loan/gi,
    real_estate: /property|real\s+estate|lease|rental|premises/gi,
    employment: /employment|employee|contractor|work\s+for\s+hire/gi,
    manufacturing: /manufacturing|production|supply\s+chain|inventory/gi
  }

  static async analyzeText(text: string, filename?: string): Promise<AdvancedAnalysisResult> {
    // Check if Gemini API key is configured
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0
    
    if (!hasApiKey) {
      console.warn('⚠️  GEMINI API KEY NOT CONFIGURED')
      console.warn('📋 Using fallback pattern-based analysis')
      console.warn('🔧 See GEMINI_API_SETUP.md for configuration instructions')
    }

    try {
      // Use Gemini AI for comprehensive analysis (only if API key exists)
      if (hasApiKey) {
        const geminiAnalysis = await this.getGeminiComprehensiveAnalysis(text)
        
        if (geminiAnalysis) {
          // Add file metadata to Gemini results
          geminiAnalysis.file_metadata = {
            filename: filename || 'untitled.txt',
            file_type: 'text/plain',
            file_size: text.length,
            extracted_text_length: text.length,
            processing_timestamp: new Date().toISOString()
          }
          console.log('✅ Gemini AI analysis completed successfully')
          return geminiAnalysis
        }
      }
    } catch (error) {
      console.warn('❌ Gemini comprehensive analysis failed, using fallback:', error)
    }

    // Fallback to pattern-based analysis if Gemini fails
    console.log('Using fallback pattern-based analysis')
    
    const analysis = {
      textLength: text.length,
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).length - 1,
      paragraphCount: text.split(/\n\s*\n/).length
    }

    // Use synchronous pattern-based analysis for fallback
    const riskAssessment = this.getFallbackRiskAssessment(text)
    console.log('✅ Fallback risk assessment completed:', riskAssessment)
    const financialAnalysis = this.analyzeFinancials(text)
    const industryContext = this.detectIndustry(text)
    const clauseAnalysis = this.analyzeClauses(text)
    const criticalIssues = this.identifyCriticalIssues(text, riskAssessment)
    const summary = this.generateSummary(text, analysis, riskAssessment, industryContext)
    
    return {
      summary,
      overall_risk_score: riskAssessment.overallScore,
      risk_confidence: riskAssessment.confidence,
      document_type: this.classifyDocument(text),
      industry_context: industryContext,
      risk_breakdown: riskAssessment.breakdown,
      key_findings: this.generateKeyFindings(text, analysis, riskAssessment),
      recommendations: this.generateRecommendations(riskAssessment, criticalIssues),
      critical_issues: criticalIssues,
      clauses: clauseAnalysis,
      financial_analysis: financialAnalysis,
      file_metadata: {
        filename: filename || 'untitled.txt',
        file_type: 'text/plain',
        file_size: text.length,
        extracted_text_length: text.length,
        processing_timestamp: new Date().toISOString()
      }
    }
  }

  private static async getGeminiComprehensiveAnalysis(text: string) {
    try {
      // Import Gemini client dynamically to avoid server-side issues
      const { generateContent } = await import('./geminiClient.js')
      
      const prompt = `
Analyze this legal document comprehensively and provide a complete analysis. Return a JSON object with the following EXACT structure:

{
  "summary": "Brief 2-3 sentence summary of the document",
  "overall_risk_score": number (20-95, representing overall risk level),
  "risk_confidence": number (60-95, representing analysis confidence),
  "document_type": "string (e.g., 'Service Agreement', 'Employment Contract', 'NDA')",
  "industry_context": "string (e.g., 'Technology', 'Healthcare', 'Finance')",
  "risk_breakdown": {
    "financial_risk": number (1-10),
    "legal_risk": number (1-10),
    "operational_risk": number (1-10),
    "compliance_risk": number (1-10),
    "reputational_risk": number (1-10)
  },
  "key_findings": [
    "string - key finding 1",
    "string - key finding 2",
    "string - key finding 3"
  ],
  "recommendations": [
    "string - recommendation 1",
    "string - recommendation 2",
    "string - recommendation 3"
  ],
  "critical_issues": [
    {
      "issue": "string - issue title",
      "severity": "critical|high|medium|low",
      "description": "string - detailed description",
      "recommendation": "string - specific recommendation"
    }
  ],
  "clauses": [
    {
      "clause_id": "clause_1",
      "section": "string - section name",
      "text": "string - clause text (max 200 chars)",
      "risk_level": "low|medium|high",
      "risk_score": number (1-10),
      "confidence": number (60-95),
      "risk_explanation": "string - why this clause is risky",
      "clause_type": "string - type of clause",
      "key_terms": ["term1", "term2"],
      "recommendations": ["rec1", "rec2"],
      "financial_impact": {
        "amounts": ["$amount1", "$amount2"],
        "impact_level": "low|medium|high"
      }
    }
  ],
  "financial_analysis": {
    "total_value": "string - total contract value",
    "payment_terms": ["term1", "term2"],
    "penalties": [
      {
        "trigger": "string - what triggers penalty",
        "amount": "string - penalty amount",
        "type": "string - type of penalty"
      }
    ],
    "liability_caps": ["cap1", "cap2"]
  }
}

IMPORTANT ANALYSIS GUIDELINES:
- Analyze ALL clauses and legal terms thoroughly
- Identify specific financial amounts, percentages, and terms
- Assess liability exposure and risk factors
- Consider industry-specific compliance requirements
- Evaluate termination, indemnification, and IP clauses
- Provide actionable recommendations
- Be precise with risk scoring (avoid extremes unless justified)

Document to analyze:
${text.substring(0, 6000)}${text.length > 6000 ? '...' : ''}
`

      const response = await generateContent(prompt)
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0])
        
        // Validate the response structure
        if (analysisData.summary && 
            analysisData.overall_risk_score && 
            analysisData.risk_confidence && 
            analysisData.risk_breakdown) {
          
          console.log('Gemini Comprehensive Analysis:', analysisData)
          return analysisData
        }
      }
      
      return null
    } catch (error) {
      console.error('Gemini comprehensive analysis error:', error)
      return null
    }
  }

  private static async getGeminiRiskAssessment(text: string) {
    try {
      // Import Gemini client dynamically to avoid server-side issues
      const { generateContent } = await import('./geminiClient.js')
      
      const prompt = `
Analyze this legal document and provide a comprehensive risk assessment. Return a JSON object with the following structure:

{
  "overallScore": number (20-95, representing overall risk level),
  "confidence": number (60-95, representing analysis confidence),
  "breakdown": {
    "financial_risk": number (1-10),
    "legal_risk": number (1-10), 
    "operational_risk": number (1-10),
    "compliance_risk": number (1-10),
    "reputational_risk": number (1-10)
  },
  "patternMatches": number,
  "riskDensity": number,
  "reasoning": "Brief explanation of the risk assessment"
}

Consider these factors:
- Liability clauses (unlimited liability = high risk)
- Financial obligations and penalties
- Termination conditions
- Indemnification requirements
- Compliance obligations
- Intellectual property terms
- Confidentiality requirements

Document to analyze:
${text.substring(0, 4000)}${text.length > 4000 ? '...' : ''}
`

      const response = await generateContent(prompt)
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const riskData = JSON.parse(jsonMatch[0])
        
        // Validate the response structure
        if (riskData.overallScore && riskData.confidence && riskData.breakdown) {
          console.log('Gemini Risk Assessment:', riskData)
          return riskData
        }
      }
      
      return null
    } catch (error) {
      console.error('Gemini risk assessment error:', error)
      return null
    }
  }

  private static getFallbackRiskAssessment(text: string) {
    // Synchronous pattern-based risk assessment for fallback
    let confidence = 85
    const breakdown = {
      financial_risk: 1,
      legal_risk: 1,
      operational_risk: 1,
      compliance_risk: 1,
      reputational_risk: 1
    }

    // Enhanced scoring with weighted categories
    let criticalScore = 0
    let highScore = 0
    let mediumScore = 0
    let financialScore = 0
    let patternCount = 0

    // 1. CRITICAL PATTERNS (Highest Impact) - More conservative scoring
    Object.entries(this.RISK_PATTERNS.CRITICAL).forEach(([key, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        criticalScore += 15 * Math.min(matches.length, 2) // Reduced from 30, cap at 2
        breakdown.legal_risk += 2
        breakdown.compliance_risk += 1.5
        confidence += 5
        patternCount++
      }
    })

    // 2. HIGH RISK PATTERNS (Significant Impact) - Reduced scoring
    Object.entries(this.RISK_PATTERNS.HIGH).forEach(([key, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        highScore += 8 * Math.min(matches.length, 2) // Reduced from 18, cap at 2
        
        // Categorize risks more accurately
        if (key.includes('financial') || key.includes('damages') || key.includes('penalty')) {
          breakdown.financial_risk += 1.5
          financialScore += 8
        } else if (key.includes('liability') || key.includes('indemnif')) {
          breakdown.legal_risk += 1.5
          breakdown.reputational_risk += 0.5
        } else if (key.includes('termination') || key.includes('breach')) {
          breakdown.operational_risk += 1.2
          breakdown.legal_risk += 0.8
        } else {
          breakdown.legal_risk += 1.2
        }
        
        confidence += 2
        patternCount++
      }
    })

    // 3. MEDIUM RISK PATTERNS (Moderate Impact) - Reduced scoring
    Object.entries(this.RISK_PATTERNS.MEDIUM).forEach(([key, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        mediumScore += 5 * Math.min(matches.length, 2) // Reduced from 10
        breakdown.operational_risk += 1
        breakdown.compliance_risk += 0.8
        patternCount++
      }
    })

    // 4. FINANCIAL RISK ANALYSIS
    const amounts = text.match(this.FINANCIAL_PATTERNS.amounts) || []
    const percentages = text.match(/(\d+(?:\.\d+)?)%/g) || []
    
    amounts.forEach(amount => {
      const value = parseFloat(amount.replace(/[$,]/g, ''))
      if (value >= 100000) {
        financialScore += 12 // Reduced from 25
        breakdown.financial_risk += 2
      } else if (value >= 50000) {
        financialScore += 10 // Reduced from 20
        breakdown.financial_risk += 1.5
      } else if (value >= 10000) {
        financialScore += 8 // Reduced from 15
        breakdown.financial_risk += 1.2
      } else if (value >= 1000) {
        financialScore += 5 // Reduced from 10
        breakdown.financial_risk += 0.8
      }
    })

    percentages.forEach(percent => {
      const rate = parseFloat(percent.replace('%', ''))
      if (rate >= 25) {
        financialScore += 10 // Reduced from 20
        breakdown.financial_risk += 1.5
      } else if (rate >= 18) {
        financialScore += 8 // Reduced from 15
        breakdown.financial_risk += 1.2
      } else if (rate >= 12) {
        financialScore += 5 // Reduced from 10
        breakdown.financial_risk += 1
      }
    })

    // 5. COMPOUND RISK CALCULATION - More balanced approach
    let baseScore = 20 // Base score for any legal document
    
    // Weight different risk categories with reduced impact
    const weightedScore = 
      (criticalScore * 0.8) +     // Critical risks at 80% weight (reduced)
      (highScore * 0.6) +         // High risks at 60% weight (reduced)
      (mediumScore * 0.4) +       // Medium risks at 40% weight (reduced)
      (financialScore * 0.5)      // Financial risks at 50% weight (reduced)

    // Apply pattern density bonus/penalty - more conservative
    let densityMultiplier = 1.0
    const textLength = text.length
    const riskDensity = patternCount / (textLength / 1000) // Risks per 1000 characters
    
    if (riskDensity > 8) {
      densityMultiplier = 1.15 // Reduced from 1.2
    } else if (riskDensity > 5) {
      densityMultiplier = 1.08 // Reduced from 1.1
    } else if (riskDensity < 1) {
      densityMultiplier = 0.95 // Less penalty
    }

    // Calculate final score with logarithmic scaling to prevent ceiling hits
    let rawScore = baseScore + (weightedScore * densityMultiplier)
    
    // Apply logarithmic scaling for high scores to create more realistic distribution
    let totalScore
    if (rawScore > 80) {
      // Use logarithmic scaling for very high scores
      totalScore = 80 + (Math.log(rawScore - 79) / Math.log(2)) * 5
    } else {
      totalScore = rawScore
    }

    // Apply ceiling and floor with better distribution
    totalScore = Math.max(20, Math.min(95, totalScore))

    // Adjust confidence based on pattern matches and text length
    if (patternCount >= 10) {
      confidence = Math.min(95, confidence + 10)
    } else if (patternCount >= 5) {
      confidence = Math.min(95, confidence + 5)
    } else if (patternCount < 2) {
      confidence = Math.max(60, confidence - 10)
    }

    if (textLength < 500) {
      confidence = Math.max(50, confidence - 15) // Lower confidence for short texts
    } else if (textLength > 5000) {
      confidence = Math.min(95, confidence + 5) // Higher confidence for longer texts
    }

    // Normalize breakdown scores to 1-10 scale
    Object.keys(breakdown).forEach(key => {
      const typedKey = key as keyof typeof breakdown
      breakdown[typedKey] = Math.max(1, Math.min(10, breakdown[typedKey]))
    })

    // Debug logging to understand scoring
    console.log('Risk Assessment Debug:', {
      criticalScore,
      highScore,
      mediumScore,
      financialScore,
      patternCount,
      rawScore: baseScore + (weightedScore * densityMultiplier),
      finalScore: Math.round(totalScore),
      textLength,
      riskDensity
    })

    return {
      overallScore: Math.round(totalScore),
      confidence: Math.round(confidence),
      breakdown,
      patternMatches: patternCount,
      riskDensity: Math.round(riskDensity * 100) / 100
    }
  }

  private static analyzeFinancials(text: string) {
    const amounts = text.match(this.FINANCIAL_PATTERNS.amounts) || []
    const paymentTerms = text.match(this.FINANCIAL_PATTERNS.payment_terms) || []
    
    if (amounts.length === 0 && paymentTerms.length === 0) return undefined

    return {
      total_value: amounts[0] || 'Not specified',
      payment_terms: paymentTerms.slice(0, 3),
      penalties: this.extractPenalties(text),
      liability_caps: this.extractLiabilityCaps(text)
    }
  }

  private static extractPenalties(text: string) {
    const penalties = []
    const penaltyPattern = /penalty|fine|liquidated\s+damages/gi
    const matches = text.match(penaltyPattern)
    
    if (matches) {
      penalties.push({
        trigger: 'Contract breach or non-compliance',
        amount: 'As specified in contract',
        type: 'Monetary penalty'
      })
    }
    
    return penalties
  }

  private static extractLiabilityCaps(text: string) {
    const caps = []
    const capPattern = /liability.*limited\s+to|cap.*liability|maximum.*liability/gi
    const matches = text.match(capPattern)
    
    if (matches) {
      caps.push({
        type: 'General liability cap',
        amount: 'As specified in contract',
        scope: 'Contract performance'
      })
    }
    
    return caps
  }

  private static detectIndustry(text: string): string {
    let maxMatches = 0
    let detectedIndustry = 'General Business'

    Object.entries(this.INDUSTRY_INDICATORS).forEach(([industry, pattern]) => {
      const matches = text.match(pattern)
      if (matches && matches.length > maxMatches) {
        maxMatches = matches.length
        detectedIndustry = industry.charAt(0).toUpperCase() + industry.slice(1)
      }
    })

    return detectedIndustry
  }

  private static analyzeClauses(text: string) {
    const clauses: any[] = []
    
    // Split text into meaningful clauses/paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30)
    
    // Use paragraphs if available, otherwise use longer sentences
    const textSegments = paragraphs.length > 0 ? paragraphs : sentences
    
    // Analyze up to 10 most significant clauses
    textSegments.slice(0, 10).forEach((segment, index) => {
      const cleanText = segment.trim().replace(/\s+/g, ' ')
      if (cleanText.length < 30) return
      
      const riskAssessment = this.assessClauseRisk(cleanText)
      const clauseType = this.identifyClauseType(cleanText)
      const financialImpact = this.assessFinancialImpact(cleanText)
      
      clauses.push({
        clause_id: `clause_${index + 1}`,
        section: clauseType.section || `Clause ${index + 1}`,
        text: cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText,
        risk_level: riskAssessment.level,
        risk_score: riskAssessment.score,
        confidence: riskAssessment.confidence,
        risk_explanation: riskAssessment.explanation,
        clause_type: clauseType.type,
        key_terms: this.extractKeyTerms(cleanText),
        recommendations: this.generateClauseRecommendations(cleanText, riskAssessment),
        financial_impact: financialImpact
      })
    })

    return clauses
  }

  private static identifyClauseType(clause: string) {
    const types = {
      'Payment Terms': /payment|pay|invoice|billing|due|fee|cost|price|amount/gi,
      'Liability': /liability|liable|responsible|damages|harm|loss|injury/gi,
      'Termination': /terminat|end|expir|cancel|dissolv|breach/gi,
      'Confidentiality': /confidential|proprietary|non.?disclosure|secret|private/gi,
      'Intellectual Property': /intellectual\s+property|copyright|trademark|patent|IP/gi,
      'Indemnification': /indemnif|hold\s+harmless|defend/gi,
      'Governing Law': /governing\s+law|jurisdiction|venue|court|legal/gi,
      'Force Majeure': /force\s+majeure|act\s+of\s+god|unforeseeable/gi,
      'Warranty': /warrant|guarantee|represent|assur/gi,
      'Assignment': /assign|transfer|delegate|successor/gi
    }

    for (const [type, pattern] of Object.entries(types)) {
      if (pattern.test(clause)) {
        return { type, section: `${type} Clause` }
      }
    }

    return { type: 'General', section: 'General Provision' }
  }

  private static extractKeyTerms(clause: string) {
    const keyTermPatterns = [
      /\$[\d,]+(?:\.\d{2})?/g, // Dollar amounts
      /\d+\s*(?:days?|months?|years?)/gi, // Time periods
      /\d+%/g, // Percentages
      /(?:shall|must|will|may|should)\s+\w+/gi, // Obligation terms
      /(?:immediately|within|before|after|upon)/gi // Timing terms
    ]

    const terms: string[] = []
    keyTermPatterns.forEach(pattern => {
      const matches = clause.match(pattern)
      if (matches) {
        terms.push(...matches.slice(0, 3)) // Limit to 3 matches per pattern
      }
    })

    return terms.slice(0, 5) // Return top 5 key terms
  }

  private static generateClauseRecommendations(clause: string, riskAssessment: any) {
    const recommendations = []

    if (riskAssessment.level === 'high') {
      recommendations.push('Seek legal review before agreeing to this clause')
      
      if (/unlimited|without\s+limitation/gi.test(clause)) {
        recommendations.push('Negotiate liability caps to limit exposure')
      }
      
      if (/immediate|immediately/gi.test(clause)) {
        recommendations.push('Request reasonable notice period')
      }
    }

    if (/payment|pay|fee/gi.test(clause)) {
      recommendations.push('Verify payment terms and amounts are acceptable')
      recommendations.push('Consider adding late payment penalties')
    }

    if (/confidential/gi.test(clause)) {
      recommendations.push('Ensure confidentiality obligations are mutual')
      recommendations.push('Define what constitutes confidential information')
    }

    if (/terminat/gi.test(clause)) {
      recommendations.push('Negotiate adequate termination notice period')
      recommendations.push('Clarify post-termination obligations')
    }

    return recommendations.slice(0, 3) // Return top 3 recommendations
  }

  private static assessFinancialImpact(clause: string) {
    const amounts = clause.match(/\$[\d,]+(?:\.\d{2})?/g)
    const percentages = clause.match(/\d+%/g)
    
    if (amounts || percentages) {
      return {
        has_financial_terms: true,
        amounts: amounts || [],
        percentages: percentages || [],
        impact_level: amounts && amounts.length > 0 ? 'high' : 'medium'
      }
    }

    if (/penalty|fine|damages|fee|cost/gi.test(clause)) {
      return {
        has_financial_terms: true,
        amounts: [],
        percentages: [],
        impact_level: 'medium',
        note: 'Financial implications present but amounts not specified'
      }
    }

    return {
      has_financial_terms: false,
      impact_level: 'low'
    }
  }

  private static assessClauseRisk(clause: string) {
    const criticalMatches = Object.values(this.RISK_PATTERNS.CRITICAL).some(pattern => 
      pattern.test(clause)
    )
    const highMatches = Object.values(this.RISK_PATTERNS.HIGH).some(pattern => 
      pattern.test(clause)
    )
    const mediumMatches = Object.values(this.RISK_PATTERNS.MEDIUM).some(pattern => 
      pattern.test(clause)
    )

    if (criticalMatches) {
      return { 
        level: 'high' as const, 
        score: 8, 
        confidence: 90,
        explanation: 'Contains critical risk indicators requiring immediate attention' 
      }
    } else if (highMatches) {
      return { 
        level: 'medium' as const, 
        score: 6, 
        confidence: 85,
        explanation: 'Contains elevated risk factors that should be reviewed' 
      }
    } else if (mediumMatches) {
      return { 
        level: 'medium' as const, 
        score: 4, 
        confidence: 80,
        explanation: 'Contains moderate risk elements worth noting' 
      }
    } else {
      return { 
        level: 'low' as const, 
        score: 2, 
        confidence: 75,
        explanation: 'Standard clause with minimal risk indicators' 
      }
    }
  }

  private static identifyCriticalIssues(text: string, riskAssessment: any) {
    const issues = []

    // Check for unlimited liability
    if (this.RISK_PATTERNS.CRITICAL.unlimited_liability.test(text)) {
      issues.push({
        issue: 'Unlimited Liability Exposure',
        severity: 'critical' as const,
        urgency: 'high' as const,
        impact: 'Could result in unlimited financial exposure beyond business assets',
        recommendation: 'Negotiate liability caps and limitations immediately'
      })
    }

    // Check for personal guarantees
    if (this.RISK_PATTERNS.CRITICAL.personal_guarantee.test(text)) {
      issues.push({
        issue: 'Personal Guarantee Required',
        severity: 'critical' as const,
        urgency: 'high' as const,
        impact: 'Personal assets may be at risk if business obligations are not met',
        recommendation: 'Seek legal counsel before agreeing to personal guarantees'
      })
    }

    // Check for high-risk litigation clauses
    if (this.RISK_PATTERNS.HIGH.litigation.test(text)) {
      issues.push({
        issue: 'Litigation Risk Present',
        severity: 'high' as const,
        urgency: 'high' as const,
        impact: 'Potential for costly legal disputes and enforcement actions',
        recommendation: 'Review dispute resolution mechanisms and consider arbitration clauses'
      })
    }

    // Add general high-risk warning if overall score is high
    if (riskAssessment.overallScore > 70) {
      issues.push({
        issue: 'High Overall Risk Score',
        severity: 'high' as const,
        urgency: 'medium' as const,
        impact: 'Multiple risk factors present that could affect business operations',
        recommendation: 'Comprehensive legal review recommended before proceeding'
      })
    }

    return issues
  }

  private static classifyDocument(text: string): string {
    if (/contract|agreement/gi.test(text)) return 'Legal Contract'
    if (/policy|procedure/gi.test(text)) return 'Policy Document'
    if (/terms.*service|terms.*use/gi.test(text)) return 'Terms of Service'
    if (/privacy.*policy|data.*protection/gi.test(text)) return 'Privacy Policy'
    if (/employment|job.*description/gi.test(text)) return 'Employment Document'
    return 'Legal Document'
  }

  private static generateSummary(text: string, analysis: any, riskAssessment: any, industry: string): string {
    const riskLevel = riskAssessment.overallScore > 70 ? 'high' : 
                     riskAssessment.overallScore > 40 ? 'moderate' : 'low'
    
    return `Comprehensive analysis of ${analysis.wordCount} words across ${analysis.sentenceCount} sentences. ` +
           `Document classified as ${industry} with ${riskLevel} risk level (${riskAssessment.overallScore}/100). ` +
           `Key risk areas identified include legal compliance, financial obligations, and operational requirements. ` +
           `Analysis confidence: ${riskAssessment.confidence}%.`
  }

  private static generateKeyFindings(text: string, analysis: any, riskAssessment: any): string[] {
    const findings = []
    
    findings.push(`Document contains ${analysis.wordCount} words in ${analysis.paragraphCount} paragraphs`)
    
    if (riskAssessment.overallScore > 70) {
      findings.push('High-risk elements detected requiring immediate attention')
    } else if (riskAssessment.overallScore > 40) {
      findings.push('Moderate risk factors present requiring review')
    } else {
      findings.push('Low risk profile with standard legal language')
    }

    if (this.FINANCIAL_PATTERNS.amounts.test(text)) {
      findings.push('Financial terms and monetary obligations specified')
    }

    if (this.RISK_PATTERNS.HIGH.indemnification.test(text)) {
      findings.push('Indemnification clauses present')
    }

    return findings
  }

  private static generateRecommendations(riskAssessment: any, criticalIssues: any[]): string[] {
    const recommendations = []

    if (criticalIssues.length > 0) {
      recommendations.push('Immediate legal review required due to critical issues identified')
    }

    if (riskAssessment.overallScore > 60) {
      recommendations.push('Negotiate risk mitigation clauses before signing')
    }

    if (riskAssessment.breakdown.financial_risk > 6) {
      recommendations.push('Review financial obligations and payment terms carefully')
    }

    if (riskAssessment.breakdown.legal_risk > 6) {
      recommendations.push('Consult with legal counsel regarding compliance requirements')
    }

    recommendations.push('Ensure all parties understand their obligations and rights')
    recommendations.push('Consider adding termination and dispute resolution clauses')

    return recommendations
  }
}
