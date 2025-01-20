'use client'

import { motion } from "framer-motion"

interface LoadingReelProps {
  text?: string
  color?: string
  backgroundColor?: string
  className?: string
}

export function LoadingReel({
  text = "Loading",
  color = "#3D314A",
  backgroundColor = "#F5F1ED",
  className = ""
}: LoadingReelProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        className="relative w-14 h-[70px] z-0"
        style={{ backgroundColor: color }}
      >
        <motion.div
          className="absolute h-[120%] border-l-[5px] border-dashed"
          style={{ 
            borderColor: backgroundColor,
            left: '5px'
          }}
          animate={{
            top: [0, -15],
          }}
          transition={{
            duration: 0.02,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute h-[120%] border-l-[5px] border-dashed"
          style={{ 
            borderColor: backgroundColor,
            right: '5px'
          }}
          animate={{
            top: [0, -15],
          }}
          transition={{
            duration: 0.02,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      <p 
        className="mt-[5px] mx-auto uppercase tracking-wider font-['Anton']"
        style={{ color }}
      >
        {text}
      </p>
    </div>
  )
} 