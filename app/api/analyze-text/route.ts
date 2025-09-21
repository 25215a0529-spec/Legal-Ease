import { NextRequest, NextResponse } from 'next/server'
import { LegalAnalysisEngine } from '@/lib/analysis-engine'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: { message: 'Text is required' } },
        { status: 400 }
      )
    }

    // Use enhanced analysis engine with Gemini AI
    const analysisResult = await LegalAnalysisEngine.analyzeText(text)

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error('Text analysis error:', error)
    return NextResponse.json(
      { error: { message: 'AI Analysis Service Unavailable' } },
      { status: 503 }
    )
  }
}
