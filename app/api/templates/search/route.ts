import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: { message: 'Search query is required' } },
        { status: 400 }
      )
    }

    // Mock search results - filter templates based on query
    const mockTemplates = [
      {
        id: '1',
        title: 'Non-Disclosure Agreement',
        description: 'Standard NDA template for business partnerships',
        category: 'contracts',
        file_url: '/templates/nda-template.pdf',
        preview_url: '/templates/previews/nda-preview.png',
        tags: ['nda', 'confidentiality', 'business'],
        downloads: 1250,
        rating: 4.8
      },
      {
        id: '2',
        title: 'Service Agreement',
        description: 'Comprehensive service agreement template',
        category: 'contracts',
        file_url: '/templates/service-agreement.pdf',
        preview_url: '/templates/previews/service-preview.png',
        tags: ['service', 'agreement', 'business'],
        downloads: 890,
        rating: 4.6
      },
      {
        id: '3',
        title: 'Employment Contract',
        description: 'Standard employment contract template',
        category: 'employment',
        file_url: '/templates/employment-contract.pdf',
        preview_url: '/templates/previews/employment-preview.png',
        tags: ['employment', 'contract', 'hr'],
        downloads: 2100,
        rating: 4.9
      }
    ]

    // Simple search - filter by title, description, or tags
    const searchResults = mockTemplates.filter(template => 
      template.title.toLowerCase().includes(query.toLowerCase()) ||
      template.description.toLowerCase().includes(query.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )

    return NextResponse.json(searchResults)
  } catch (error) {
    console.error('Template search error:', error)
    return NextResponse.json(
      { error: { message: 'Template Search Service Unavailable' } },
      { status: 503 }
    )
  }
}
