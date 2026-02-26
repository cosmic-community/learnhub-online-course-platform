'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The only way to do great work is to love what you learn.",
    author: "Inspired by Steve Jobs",
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
  },
  {
    text: "The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
  },
]

export default function MotivationalQuote() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Set initial quote based on time of day
    const hour = new Date().getHours()
    setQuoteIndex(hour % quotes.length)

    // Rotate quotes every 10 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length)
        setIsVisible(true)
      }, 500)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const quote = quotes[quoteIndex]
  
  if (!quote) return null

  return (
    <div 
      className={`mb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700">
        <span className="text-lg">✨</span>
        <blockquote className="text-navy-300 text-sm italic">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <span className="text-navy-500 text-xs">— {quote.author}</span>
      </div>
    </div>
  )
}