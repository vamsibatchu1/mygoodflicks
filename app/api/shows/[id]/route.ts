import { NextResponse } from 'next/server'
import { getShowDetails } from '@/lib/services/shows'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const show = await getShowDetails(params.id)
    return NextResponse.json(show)
  } catch (error) {
    console.error('Error fetching show:', error)
    return NextResponse.json({ error: 'Failed to fetch show details' }, { status: 500 })
  }
}