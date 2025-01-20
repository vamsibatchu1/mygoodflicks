'use client'
import { Special_Elite } from 'next/font/google'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const typewriterFont = Special_Elite({ 
    weight: '400',
    subsets: ['latin'] 
  })

// Shared timing configuration for both typing and audio
const SEQUENCE_TIMING = [
  { 
    text: "Ever spent an hour scrolling, trying to decide what to watch, only to give up? ",
    time: 4,
    pause: 1000
  },
  { 
    text: "We have all been there. Endless recommendations from friends, reviews scattered across apps, and the overwhelming choice of what is trending. ",
    time: 12,
    pause: 1000
  },
  { 
    text: "That is where Good Flicks comes in. We bring everything you need into one place - your friends' recommendations, trending titles, and personalized picks based on what you love. ",
    time: 20.84,
    pause: 1000
  },
  { 
    text: "No more endless searching. Just great movies and shows, ready for you to enjoy. ",
    time: 18.45,
    pause: 1000
  },
  { 
    text: "Because time is precious—and you deserve the perfect watch, every time.",
    time: 29.88,
    pause: 1000
  }
]

// For audio breaks
const AUDIO_BREAKS = SEQUENCE_TIMING.map(({ time, pause }) => ({
  time,
  duration: pause
}))

// For typing sequence
const TYPING_SEQUENCE = SEQUENCE_TIMING.map(({ text, pause }) => ({
  text,
  pause
}))

export default function WelcomePage() {
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  useEffect(() => {
    const typeSound = new Audio('/assets/sounds/type.mov')
    typeSound.volume = 0.3
    let isPaused = false  // Flag to prevent multiple pauses

    typeSound.addEventListener('timeupdate', () => {
      const currentTime = typeSound.currentTime
      console.log('Current time:', currentTime)  // Debug current time
      
      AUDIO_BREAKS.forEach(({ time }) => {
        // Wider time window for catching the break point
        if (!isPaused && currentTime >= time && currentTime <= time + 0.2) {
          console.log('Pausing at:', time)  // Debug pause points
          isPaused = true
          typeSound.pause()
          
          setTimeout(() => {
            console.log('Resuming after:', time)  // Debug resume points
            typeSound.play()
            isPaused = false
          }, 1000)
        }
      })
    })

    setAudio(typeSound)

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [])

  const playTypeSound = () => {
    if (audio) {
      audio.currentTime = 0
      audio.play()
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-top md:justify-center justify-start bg-black text-white p-8 pt-24 md:p-4"
      onClick={() => {
        if (!hasInteracted && audio) {
          setHasInteracted(true)
          audio.play()
        }
      }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl text-left"
      >
        {!showTyping ? (
          <div className={`${typewriterFont.className} text-xl md:text-2xl mb-8 cursor-pointer`}
               onClick={() => {
                 setShowTyping(true)
                 if (audio) {
                   audio.play()
                 }
               }}>
            <span className="animate-pulse">|</span>
            <span className="animate-fade-in-slow"> tap here to begin</span>
          </div>
        ) : (
          <div className={`${typewriterFont.className} text-lg md:text-2xl mb-8 h-[300px]`}>
            <Typewriter
              options={{
                delay: 50,
                cursor: '|',
                autoStart: true
              }}
              onInit={(typewriter) => {
                TYPING_SEQUENCE.forEach(({ text, pause }) => {
                  typewriter
                    .typeString(text)
                    .pauseFor(pause)
                })
                typewriter
                  .callFunction(() => setIsComplete(true))
                  .start()
              }}
            />
          </div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 140 }}
            animate={{ opacity: 1, y: 60 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/assets/images/logos/white-wordmark.png" 
              alt="GoodFlicks"
              className="h-8 md:h-12 w-auto mb-4 md:mb-8 ml-0 md:ml-5 mt-16"
            />
            <Button 
              size="lg"
              onClick={() => router.push('/auth?tab=signup')}
              className="bg-white text-black hover:bg-gray-200 mt-2 md:mt-0"
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 