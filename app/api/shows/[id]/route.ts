import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const searchTerm = params.id
    console.log('Searching for:', searchTerm)

    const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
    const omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(searchTerm)}`
    
    console.log('Fetching from OMDB:', omdbUrl)
    const omdbResponse = await fetch(omdbUrl)
    const omdbData = await omdbResponse.json()
    
    if (omdbData.Response === "True") {
      const showRef = doc(db, 'shows', searchTerm)
      const showData = {
        id: searchTerm,
        title: omdbData.Title,
        description: omdbData.Plot,
        imageUrl: omdbData.Poster,
        genres: omdbData.Genre ? omdbData.Genre.split(', ') : [],
        ratings: {
          networkScore: omdbData.imdbRating === 'N/A' ? 0 : parseFloat(omdbData.imdbRating),
          allTimeScore: omdbData.Metascore === 'N/A' ? 0 : parseInt(omdbData.Metascore),
          imdbVotes: omdbData.imdbVotes === 'N/A' ? 0 : parseInt(omdbData.imdbVotes.replace(/,/g, '')),
          rottenTomatoes: "N/A"
        }
      }

      await setDoc(showRef, showData)
      return NextResponse.json(showData)
    }
    
    return NextResponse.json({ error: 'Show not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch show' },
      { status: 500 }
    )
  }
}