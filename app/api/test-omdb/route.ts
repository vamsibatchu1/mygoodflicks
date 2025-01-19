import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Mark this route as dynamic

export async function GET() {
  const apiKey = process.env.OMDB_API_KEY
  const testUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=inception`

  try {
    const response = await fetch(testUrl)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('OMDB API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch from OMDB' }, { status: 500 })
  }
} 