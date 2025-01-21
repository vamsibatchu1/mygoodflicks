'use client'
import { Special_Elite } from 'next/font/google'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const typewriterFont = Special_Elite({ 
  weight: '400',
  subsets: ['latin'] 
})

const SEQUENCE = [
  { 
    text: "Ever spent an hour scrolling, trying to decide what to watch, only to give up? ",
    audioFile: '/assets/sounds/type1.mp3', // 4.5 seconds
    duration: 4.5,
    pause: 500
  },
  { 
    text: "We have all been there. Endless recommendations from friends, reviews scattered across apps, and the overwhelming choice of what is trending. ",
    audioFile: '/assets/sounds/type2.mov', // 7.63 seconds
    duration: 7.63,
    pause: 500
  },
  { 
    text: "That is where Good Flicks comes in. We bring everything you need into one place - your friends' recommendations, trending titles, and personalized picks based on what you love. ",
    audioFile: '/assets/sounds/type3.mov', // 10.3 seconds
    duration: 10.3,
    pause: 500
  },
  { 
    text: "No more endless searching. Just great movies and shows, ready for you to enjoy. ",
    audioFile: '/assets/sounds/type4.mp3', // 5.41 seconds
    duration: 5.41,
    pause: 500
  },
  { 
    text: "Because time is precious—and you deserve the perfect watch, every time.",
    audioFile: '/assets/sounds/type5.mov', // 4.5 seconds
    duration: 4.5,
    pause: 500
  }
]

export default function WelcomePage() {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const playNextSequence = async (index: number) => {
    if (index >= SEQUENCE.length) {
      setIsComplete(true)
      return
    }

    // Cleanup previous audio if exists
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.removeEventListener('ended', () => {})
    }

    const audio = new Audio(SEQUENCE[index].audioFile)
    audio.volume = 0.3
    setCurrentAudio(audio)
    setCurrentIndex(index)
    
    try {
      // Define the ended handler
      const handleEnded = () => {
        console.log(`Audio ${index + 1} ended`); // Debug log
        setTimeout(() => {
          playNextSequence(index + 1)
        }, SEQUENCE[index].pause)
      }

      // Add the event listener
      audio.addEventListener('ended', handleEnded)
      await audio.play()

      // Cleanup when component unmounts or audio changes
      return () => {
        audio.removeEventListener('ended', handleEnded)
      }
    } catch (error) {
      console.error('Audio playback failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-top md:justify-center justify-start bg-black text-white p-12 pt-24 md:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl text-left"
      >
        {!showTyping ? (
          <div 
            className={`${typewriterFont.className} text-xl md:text-2xl mb-8 cursor-pointer`}
            onClick={() => {
              setShowTyping(true)
              playNextSequence(0)
            }}
          >
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
                SEQUENCE.forEach(({ text, pause }) => {
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