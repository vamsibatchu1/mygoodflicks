'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Users, Lock } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  const [isHovered, setIsHovered] = useState(false)
  const [activePosters, setActivePosters] = useState(thumbnails.slice(0, 3))

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isHovered && thumbnails.length > 3) {
      interval = setInterval(() => {
        setActivePosters(current => {
          const newPosters = [...current]
          // Move the first poster to the end
          const firstPoster = newPosters.shift()
          if (firstPoster) {
            newPosters.push(firstPoster)
          }
          // Add next poster from the full list if available
          const nextIndex = thumbnails.indexOf(newPosters[newPosters.length - 1]) + 1
          if (nextIndex < thumbnails.length) {
            newPosters[2] = thumbnails[nextIndex]
          } else {
            newPosters[2] = thumbnails[0]
          }
          return newPosters
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered, thumbnails])

  const getPositionStyles = (index: number) => {
    const positions = [
      { zIndex: 3, x: 0, y: 0, rotate: 0, scale: 1 },      // front
      { zIndex: 2, x: 20, y: 0, rotate: -5, scale: 0.95 }, // middle
      { zIndex: 1, x: 40, y: 0, rotate: -10, scale: 0.9 }  // back
    ]
    return positions[index]
  }

  return (
    <motion.div 
      className="w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false)
        setActivePosters(thumbnails.slice(0, 3))
      }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-[220px] p-4 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {activePosters.map((poster, index) => {
              const position = getPositionStyles(index)
              return (
                <motion.div
                  key={poster} // Using the poster URL as the key for proper animation
                  className="absolute rounded-lg overflow-hidden shadow-md border border-gray-200"
                  style={{
                    width: '120px',
                    height: '180px',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    x: 'calc(-50% + 60px)',
                    y: '-50%',
                    rotate: -15,
                    scale: 0.8,
                    opacity: 0,
                    zIndex: 0
                  }}
                  animate={{ 
                    x: `calc(-50% + ${position.x}px)`,
                    y: '-50%',
                    rotate: position.rotate,
                    scale: position.scale,
                    opacity: 1,
                    zIndex: position.zIndex,
                    transition: { 
                      duration: 0.4,
                      ease: "easeInOut"
                    }
                  }}
                  exit={{ 
                    x: 'calc(-50% - 60px)',
                    y: '-50%',
                    rotate: 15,
                    scale: 0.8,
                    opacity: 0,
                    zIndex: 0,
                    transition: { duration: 0.3 }
                  }}
                >
                  <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <div className="flex gap-3 text-sm text-gray-600">
                <span>{movieCount} Movies</span>
                <span>{showCount} Shows</span>
              </div>
            </div>
            {!isPublic && <Lock className="h-4 w-4 text-gray-400" />}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 
