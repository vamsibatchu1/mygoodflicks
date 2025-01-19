import { NextResponse } from "next/server"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const prompt = `Suggest 5 movies or TV shows based on these preferences:
    - Genres/Moods: ${body.moods.join(', ')}
    - Watch time preference: ${body.watchTime}
    - Rating preference: ${body.ratingPreference}
    - Release time preference: ${body.releaseTime}
    
    Return ONLY the titles separated by commas, without numbers or periods.
    Example format: "The Godfather, Lawrence of Arabia, Gladiator, Braveheart, Saving Private Ryan"`
    
    console.log('OpenAI prompt:', prompt)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    const content = completion.choices[0]?.message?.content || ''
    
    // Split by commas and clean each title
    const titles = content
      .split(',')
      .map(title => title
        .replace(/^\d+\.\s*/, '') // Remove any leading numbers
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
      )
      .filter(title => title.length > 0)

    console.log('Parsed titles:', titles)

    // Fetch each movie separately
    const mediaDetails = await Promise.all(
      titles.map(async (title) => {
        try {
          const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.OMDB_API_KEY}`
          console.log('Fetching:', url)
          const response = await fetch(url)
          const data = await response.json()
          console.log('OMDB response for', title, ':', data)
          return data
        } catch (error) {
          console.error('Error fetching movie:', title, error)
          return null
        }
      })
    )

    // Filter out failed responses and null values
    const validResults = mediaDetails.filter(item => item && item.Response === 'True')
    console.log('Valid results:', validResults.length)

    return NextResponse.json(validResults)

  } catch (error: any) {
    console.error('Detailed API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get recommendations', 
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
