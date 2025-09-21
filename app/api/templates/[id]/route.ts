import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: { message: 'Template ID is required' } },
        { status: 400 }
      )
    }

    // Mock template data
    const mockTemplates: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Non-Disclosure Agreement',
        description: 'Standard NDA template for business partnerships',
        category: 'contracts',
        file_url: '/templates/nda-template.pdf',
        content: 'Mock NDA content - This would be the actual template content in a real implementation.'
      },
      '2': {
        id: '2',
        title: 'Service Agreement',
        description: 'Comprehensive service agreement template',
        category: 'contracts',
        file_url: '/templates/service-agreement.pdf',
        content: 'Mock Service Agreement content - This would be the actual template content in a real implementation.'
      },
      '3': {
        id: '3',
        title: 'Employment Contract',
        description: 'Standard employment contract template',
        category: 'employment',
        file_url: '/templates/employment-contract.pdf',
        content: 'Mock Employment Contract content - This would be the actual template content in a real implementation.'
      }
    }

    const template = mockTemplates[id]

    if (!template) {
      return NextResponse.json(
        { error: { message: 'Template not found' } },
        { status: 404 }
      )
    }

    // For now, return mock PDF content as text
    // In a real implementation, this would return the actual file
    const mockPdfContent = `Mock PDF content for ${template.title}\n\n${template.content}`
    
    return new NextResponse(mockPdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template.title.replace(/\s+/g, '-').toLowerCase()}.pdf"`
      }
    })
  } catch (error) {
    console.error('Template download error:', error)
    return NextResponse.json(
      { error: { message: 'Template Download Service Unavailable' } },
      { status: 503 }
    )
  }
}
