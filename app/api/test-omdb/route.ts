import { NextResponse } from 'next/server'

const OMDB_API_KEY = '7c57da65'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Inception'
    
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${title}`
    )
    
    const data = await response.json()
    console.log('OMDB Response:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('OMDB API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch movie data' }, { status: 500 })
  }
} 