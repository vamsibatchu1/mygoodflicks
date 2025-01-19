// OMDB API integration
// Media data fetching
// Error handling

import { NextResponse } from "next/server"
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!process.env.OMDB_API_KEY) {
    console.error("OMDB API key is not defined");
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    );
  }

  try {
    console.log("Fetching from OMDB with ID:", params.id);
    console.log("API URL:", `http://www.omdbapi.com/?i=${params.id}&apikey=${process.env.OMDB_API_KEY}`);
    
    const response = await fetch(
      `http://www.omdbapi.com/?i=${params.id}&apikey=${process.env.OMDB_API_KEY}`,
      { cache: 'no-store' }  // Disable caching for debugging
    );

    console.log("OMDB Response status:", response.status);
    const data = await response.json();
    console.log("OMDB Response data:", data);

    if (data.Response === 'False') {
      return NextResponse.json(
        { error: data.Error || "Show not found" },
        { status: 404 }
      );
    }

    const showRef = doc(db, 'shows', params.id)
    const showData = {
      id: params.id,
      title: data.Title,
      description: data.Plot,
      imageUrl: data.Poster,
      awards: data.Awards,
      genres: data.Genre ? data.Genre.split(', ') : [],
      ratings: {
        networkScore: data.imdbRating === 'N/A' ? 0 : parseFloat(data.imdbRating),
        allTimeScore: data.Metascore === 'N/A' ? 0 : parseInt(data.Metascore),
        imdbVotes: data.imdbVotes === 'N/A' ? 0 : parseInt(data.imdbVotes.replace(/,/g, '')),
        rottenTomatoes: data.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value?.replace('%', '') || "0"
      }
    }

    await setDoc(showRef, showData)
    return NextResponse.json(showData)
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch show" },
      { status: 500 }
    );
  }
}

//comment