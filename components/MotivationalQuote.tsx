'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The only way to do great work is to love what you learn.", author: "Learning Wisdom" },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % QUOTES.length
    setQuote(QUOTES[quoteIndex])
    
    // Fade in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!quote.text) return null

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative max-w-2xl mx-auto text-center">
        <span className="absolute -top-4 -left-2 text-6xl text-primary-500/20 font-serif">"</span>
        <blockquote className="relative z-10">
          <p className="text-lg text-navy-300 italic mb-2">
            {quote.text}
          </p>
          <cite className="text-sm text-navy-500 not-italic">— {quote.author}</cite>
        </blockquote>
        <span className="absolute -bottom-4 -right-2 text-6xl text-primary-500/20 font-serif rotate-180">"</span>
      </div>
    </div>
  )
}