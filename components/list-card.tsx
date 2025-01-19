'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ListCardProps {
  list: {
    id: string;
    name: string;
    isPrivate: boolean;
    items: Array<{
      title: string;
      posterPath?: string;
      type: 'movie' | 'show';
    }>;
    userId: string;
  }
}

export default function ListCard({ list }: ListCardProps) {
  const itemCount = list.items?.length || 0

  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">{list.name}</CardTitle>
            {list.isPrivate && (
              <Badge variant="secondary" className="w-fit">Private</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
              {list.items && list.items.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {list.items.slice(0, 3).map((item) => (
                    <Badge key={item.title} variant="outline">
                      {item.type === 'movie' ? '🎬' : '📺'} {item.title}
                    </Badge>
                  ))}
                  {list.items.length > 3 && (
                    <Badge variant="outline">+{list.items.length - 3} more</Badge>
                  )}
                </div>
              )}
            </div>
            {list.items && list.items.length > 0 && list.items[0].posterPath && (
              <div className="w-16 h-24 relative overflow-hidden rounded shrink-0">
                <img
                  src={list.items[0].posterPath}
                  alt={list.items[0].title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 