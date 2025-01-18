import { NextResponse } from 'next/server'
import { getShowDetails } from '@/lib/services/shows'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API Route: Fetching show details for ID:', params.id)
    
    if (!params.id) {
      console.error('No ID provided')
      return NextResponse.json({ error: 'Show ID is required' }, { status: 400 })
    }

    const show = await getShowDetails(params.id)
    
    if (!show) {
      console.error('Show not found')
      return NextResponse.json({ error: 'Show not found' }, { status: 404 })
    }

    console.log('API Route: Successfully fetched show:', show)
    return NextResponse.json(show)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch show details' },
      { status: 500 }
    )
  }
}