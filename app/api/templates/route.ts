import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Mock templates data
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

    // Filter by category if provided
    const filteredTemplates = category 
      ? mockTemplates.filter(template => template.category === category)
      : mockTemplates

    return NextResponse.json(filteredTemplates)
  } catch (error) {
    console.error('Templates error:', error)
    return NextResponse.json(
      { error: { message: 'Templates Service Unavailable' } },
      { status: 503 }
    )
  }
}
