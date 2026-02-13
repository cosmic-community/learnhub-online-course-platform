'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
]

export default function LearningQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a random quote based on the current date (changes daily)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const quoteIndex = dayOfYear % quotes.length
    setCurrentQuote(quotes[quoteIndex] ?? quotes[0])
  }, [])

  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex] ?? quotes[0])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/80 border border-navy-700/50 p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full blur-xl" />
      
      {/* Quote icon */}
      <div className="absolute top-4 left-4 text-6xl text-primary-500/20 font-serif">"</div>
      
      <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
        <p className="text-lg md:text-xl text-white font-medium leading-relaxed mb-4 pl-8">
          {currentQuote.text}
        </p>
        <p className="text-primary-400 font-medium pl-8">
          — {currentQuote.author}
        </p>
      </div>
      
      <button
        onClick={getNewQuote}
        className="mt-6 ml-8 text-sm text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
      >
        <svg 
          className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        New inspiration
      </button>

      {/* Daily badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-navy-800/80 px-3 py-1.5 rounded-full">
        <span className="text-yellow-400 text-sm">✨</span>
        <span className="text-xs text-navy-300">Daily Quote</span>
      </div>
    </div>
  )
}