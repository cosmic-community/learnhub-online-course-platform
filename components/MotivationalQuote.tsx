'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The only way to do great work is to love what you learn.",
    author: "Inspired by Steve Jobs"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  }
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Select a random quote based on the current date (changes daily)
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 
      (1000 * 60 * 60 * 24)
    )
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
  }, [])

  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setQuote(quotes[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
          Daily Inspiration
        </span>
      </div>
      
      <blockquote 
        className={`transition-all duration-300 ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-xl md:text-2xl text-white font-medium italic mb-4 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="text-navy-400">
          — {quote.author}
        </footer>
      </blockquote>
      
      <button
        onClick={getNewQuote}
        className="mt-6 inline-flex items-center gap-2 text-sm text-navy-400 hover:text-primary-400 transition-colors group"
      >
        <svg 
          className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        Get another quote
      </button>
    </div>
  )
}