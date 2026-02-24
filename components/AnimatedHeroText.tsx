'use client'

import { useState, useEffect } from 'react'

const WORDS = [
  'advance your career',
  'master new skills',
  'build amazing projects',
  'unlock your potential',
]

export default function AnimatedHeroText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayText, setDisplayText] = useState(WORDS[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % WORDS.length)
        setDisplayText(WORDS[(currentIndex + 1) % WORDS.length])
        setIsAnimating(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
      Learn skills that{' '}
      <span className="block sm:inline">
        <span 
          className={`text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 inline-block transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}
        >
          {displayText}
        </span>
      </span>
    </h1>
  )
}