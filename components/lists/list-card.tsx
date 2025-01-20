'use client'

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

interface ListCardProps {
  title: string
  isPublic: boolean
  movieCount: number
  showCount: number
  thumbnails: string[]
}

export function ListCard({ 
  title, 
  isPublic, 
  movieCount, 
  showCount, 
  thumbnails 
}: ListCardProps) {
  console.log('ListCard props:', { title, isPublic, movieCount, showCount, thumbnails }) // Debug log
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="grid grid-cols-2 gap-1 p-2 bg-gray-100">
        {/* Show up to 4 thumbnails in a 2x2 grid */}
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="aspect-[2/3] bg-gray-200 rounded overflow-hidden"
          >
            {thumbnails[index] && (
              <img 
                src={thumbnails[index]} 
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>{movieCount} Movies</span>
            <span className="mx-1">•</span>
            <span>{showCount} Shows</span>
          </div>
          {isPublic && (
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>Public</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 