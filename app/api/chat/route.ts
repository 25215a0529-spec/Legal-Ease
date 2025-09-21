import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: { message: 'Message is required' } },
        { status: 400 }
      )
    }

    // Mock chat response for now - replace with actual Gemini API call
    const chatResponse = {
      message: `Thank you for your question: "${message}". This is a mock response from the AI legal assistant. In a real implementation, this would be powered by Gemini AI to provide accurate legal guidance.`,
      conversation_id: conversation_id || `conv_${Date.now()}`
    }

    return NextResponse.json(chatResponse)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: { message: 'AI Chat Service Unavailable' } },
      { status: 503 }
    )
  }
}
