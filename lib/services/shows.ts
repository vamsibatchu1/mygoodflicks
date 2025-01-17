import { db } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import openai from '../openai';
import { Show } from '@/types';

// Error handling function
export async function getShowDetails(showId: string) {
  try {
    const showRef = doc(db, 'shows', showId);
    const showSnap = await getDoc(showRef);
    
    if (showSnap.exists()) {
      return showSnap.data() as Show;
    }
    
    const showData = await generateShowDetails(showId);
    await setDoc(showRef, showData);
    return showData;
  } catch (error) {
    console.error('Error fetching show details:', error);
    throw new Error('Failed to fetch show details');
  }
}

// Helper function to generate show details from OpenAI
async function generateShowDetails(showTitle: string) {
  try {
    console.log('Generating details for:', showTitle);
    
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides detailed information about TV shows and movies in JSON format."
        },
        {
          role: "user",
          content: `Generate information about "${showTitle}" in the following JSON format:
          {
            "title": "Show Title",
            "genres": ["Genre1", "Genre2"],
            "description": "Detailed description",
            "ratings": {
              "networkScore": "4.5",
              "allTimeScore": "4.8"
            }
          }`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const responseContent = completion.choices[0].message.content;
    console.log('OpenAI response:', responseContent);

    // Parse the OpenAI response
    const parsedData = JSON.parse(responseContent || '{}');

    const showData: Show = {
      id: showTitle.toLowerCase().replace(/\s+/g, '-'),
      title: parsedData.title || showTitle,
      genres: parsedData.genres || [],
      description: parsedData.description || '',
      imageUrl: '/placeholder.svg', // We'll handle images later
      ratings: {
        networkScore: parsedData.ratings?.networkScore || "0",
        allTimeScore: parsedData.ratings?.allTimeScore || "0"
      },
      watchlistCount: 0,
      reviewCount: 0,
      reviews: [],
      similarShows: [],
      lastUpdated: new Date().toISOString()
    };

    console.log('Generated show data:', showData);
    return showData;
  } catch (error) {
    console.error('Error generating show details:', error);
    throw error;
  }
}