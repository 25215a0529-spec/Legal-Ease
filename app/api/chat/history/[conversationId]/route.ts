import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params

    if (!conversationId) {
      return NextResponse.json(
        { error: { message: 'Conversation ID is required' } },
        { status: 400 }
      )
    }

    // Mock chat history - in a real implementation, this would fetch from a database
    const mockChatHistory = [
      {
        role: 'user' as const,
        content: 'What should I look for in a service agreement?',
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        role: 'assistant' as const,
        content: 'When reviewing a service agreement, you should pay attention to: 1) Scope of services clearly defined, 2) Payment terms and schedules, 3) Liability limitations, 4) Termination clauses, 5) Intellectual property rights, and 6) Dispute resolution mechanisms.',
        timestamp: new Date(Date.now() - 3590000).toISOString()
      },
      {
        role: 'user' as const,
        content: 'How can I protect my intellectual property in contracts?',
        timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      },
      {
        role: 'assistant' as const,
        content: 'To protect your intellectual property in contracts: 1) Include clear IP ownership clauses, 2) Use confidentiality agreements, 3) Specify work-for-hire arrangements when applicable, 4) Include non-compete clauses where legally enforceable, 5) Register your IP before disclosure, and 6) Include indemnification clauses for IP violations.',
        timestamp: new Date(Date.now() - 1790000).toISOString()
      }
    ]

    return NextResponse.json(mockChatHistory)
  } catch (error) {
    console.error('Chat history error:', error)
    return NextResponse.json(
      { error: { message: 'Chat History Service Unavailable' } },
      { status: 503 }
    )
  }
}
