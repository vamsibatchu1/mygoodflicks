'use client'

import { motion } from "framer-motion"

interface WaveLoadingProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: {
    container: "1.5rem",
    dot: "0.35rem"
  },
  md: {
    container: "2rem",
    dot: "0.5rem"
  },
  lg: {
    container: "2.5rem",
    dot: "0.65rem"
  }
}

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2
    }
  },
  end: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const loadingCircleVariants = {
  start: {
    y: "50%"
  },
  end: {
    y: "150%"
  }
}

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut"
}

export function WaveLoading({ color = "white", size = "md", className = "" }: WaveLoadingProps) {
  const containerSize = sizes[size].container
  const dotSize = sizes[size].dot

  const loadingContainer = {
    width: containerSize,
    height: containerSize,
    display: "flex",
    justifyContent: "space-around"
  }

  const loadingCircle = {
    display: "block",
    width: dotSize,
    height: dotSize,
    backgroundColor: color,
    borderRadius: "50%"
  }

  return (
    <motion.div
      style={loadingContainer}
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
      className={className}
    >
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
      <motion.span
        style={loadingCircle}
        variants={loadingCircleVariants}
        transition={loadingCircleTransition}
      />
    </motion.div>
  )
}
