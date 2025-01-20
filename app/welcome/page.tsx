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


export default function WelcomePage() {
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center p-12 md:p-24 justify-center md:justify-center bg-black text-white p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl text-left"
      >
        
        <div className={`${typewriterFont.className} text-lg md:text-2xl mb-8 h-[300px]`}>
          <Typewriter
            options={{
              delay: 50,
              cursor: '|'
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Hi there! ")
                .pauseFor(1000)
                .typeString("Ever spent an hour scrolling, trying to decide what to watch, only to give up? ")
                .pauseFor(1000)
                .typeString("We have all been there. Endless recommendations from friends, reviews scattered across apps, and the overwhelming choice of what is trending. ")
                .pauseFor(1000)
                .typeString("That is where Good Flicks comes in. We bring everything you need into one place - your friends' recommendations, trending titles, and personalized picks based on what you love. ")
                .pauseFor(1000)
                .typeString("No more endless searching. Just great movies and shows, ready for you to enjoy. ")
                .pauseFor(1000)
                .typeString("Because time is precious—and you deserve the perfect watch, every time.")
                .pauseFor(1000)
                .callFunction(() => setIsComplete(true))
                .start()
            }}
          />
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 140 }}
            animate={{ opacity: 1, y: 60 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/assets/images/logos/white-wordmark.png" 
              alt="GoodFlicks"
              className="h-8 md:h-12 w-auto mb-4 md:mb-8 ml-0 md:ml-5"
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