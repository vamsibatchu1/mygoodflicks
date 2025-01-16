import { NextResponse } from 'next/server'
import type { Show } from '@/app/flick/types'

export async function GET() {
  const mockShow: Show = {
    id: "123",
    title: "Gilmore Girls",
    genres: ["TV Comedies", "TV Dramas"],
    description: "In the beloved series from award-winning writer-director Amy Sherman-Palladino, three generations of women celebrate life's ordinary triumphs together. Set in the charming town of Stars Hollow, Connecticut, the show follows the witty and fast-talking Lorelai Gilmore and her teenage daughter Rory as they navigate life, love, and their complex relationship with family matriarch Emily. Known for its rapid-fire dialogue, pop culture references, and heartwarming moments, the series explores themes of family, friendship, ambition, and small-town life with both humor and depth.",
    imageUrl: "/placeholder.svg",
    ratings: {
      networkScore: "4.3",
      allTimeScore: "5"
    },
    watchlistCount: 15,
    reviewCount: 54,
    reviews: [
      {
        id: "1",
        name: "Martin Rashford",
        rating: "3.4",
        review: "I love the banter and the setting, but some of the storylines don't hold up as well today."
      }
    ],
    similarShows: [
      {
        title: "Nobody wants this",
        friendCount: 34,
        rating: "4.5",
        imageUrl: "/placeholder.svg"
      }
    ],
    lastUpdated: "November 23, 2023"
  }

  return NextResponse.json(mockShow)
}