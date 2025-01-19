import Link from 'next/link'
import { Card, CardContent } from './card'

interface MediaCardProps {
  media: {
    id: string;
    type: 'movie' | 'show';
    title: string;
    year?: string;
    poster?: string;
    plot?: string;
    imdbRating?: string;
  }
}

export function MediaCard({ media }: MediaCardProps) {
  return (
    <Link 
      href={`/media/${media.id}`}
      className="block hover:opacity-75 transition"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3]">
            <img
              src={media.poster !== 'N/A' ? media.poster : '/images/placeholder.jpg'}
              alt={media.title}
              className="object-cover w-full h-full"
            />
            {media.imdbRating && (
              <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded-md text-sm">
                ⭐ {media.imdbRating}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold truncate">{media.title}</h3>
            {media.year && (
              <p className="text-sm text-gray-500">{media.year}</p>
            )}
            {media.plot && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {media.plot}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 