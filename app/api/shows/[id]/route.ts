import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const searchTerm = params.id
    console.log('Searching for:', searchTerm)

    // Always fetch fresh data from OMDB first
    const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
    const omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(searchTerm)}`
    
    console.log('Fetching from OMDB:', omdbUrl)
    const omdbResponse = await fetch(omdbUrl)
    const omdbData = await omdbResponse.json()
    
    console.log('OMDB Raw Response:', omdbData)

    if (omdbData.Response === "True") {
      // Get the IMDB rating
      const imdbRating = omdbData.imdbRating
      console.log('IMDB Rating from OMDB:', imdbRating)

      const showData = {
        id: searchTerm,
        title: omdbData.Title,
        description: omdbData.Plot,
        imageUrl: omdbData.Poster,
        genres: omdbData.Genre ? omdbData.Genre.split(', ') : [],
        ratings: {
          networkScore: imdbRating === 'N/A' ? 0 : parseFloat(imdbRating),
          allTimeScore: omdbData.Metascore === 'N/A' ? 0 : parseInt(omdbData.Metascore),
          imdbVotes: 0,
          rottenTomatoes: "N/A"
        }
      }

      console.log('Fresh data from OMDB:', showData)
      
      // Update Firebase with the fresh data
      const showRef = doc(db, 'shows', searchTerm)
      await setDoc(showRef, showData)

      // Return the fresh OMDB data directly
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