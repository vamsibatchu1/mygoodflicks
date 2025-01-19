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
    
    Please provide only the titles, separated by commas.`
    
    console.log('OpenAI prompt:', prompt)

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    // Add null check and provide default empty string
    const content = completion.choices[0]?.message?.content || ''
    const titles = content
      .split(',')
      .map(title => title
        .replace(/^\d+\.\s*/, '') // Remove leading numbers
        .replace(/\n/g, '') // Remove newlines
        .trim() // Remove extra spaces
      )
      .filter(title => title.length > 0)

    console.log('Cleaned titles:', titles)

    const mediaDetails = await Promise.all(
      titles.map(async (title) => {
        const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.OMDB_API_KEY}`
        console.log('OMDB request URL:', url)
        const response = await fetch(url)
        const data = await response.json()
        console.log('OMDB response for', title, ':', data)
        return data
      })
    )

    // Filter out any failed responses
    const validResults = mediaDetails.filter(item => item.Response !== 'False')

    return NextResponse.json(validResults)

  } catch (error) {
    console.error('Detailed API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error.message },
      { status: 500 }
    )
  }
}
