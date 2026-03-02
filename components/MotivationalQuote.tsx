'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not a spectator sport.", author: "D. Blocher" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get today's quote based on the day
    const today = new Date().getDate()
    setQuote(quotes[today % quotes.length])
  }, [])

  const getNewQuote = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setQuote(quotes[randomIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
      <div 
        className={`relative px-8 py-6 text-center transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="text-4xl mb-4 opacity-20">💡</div>
        <blockquote className="text-lg md:text-xl text-navy-200 italic mb-3 max-w-2xl mx-auto">
          "{quote.text}"
        </blockquote>
        <cite className="text-primary-400 text-sm not-italic">— {quote.author}</cite>
        <button
          onClick={getNewQuote}
          className="block mx-auto mt-4 text-navy-500 hover:text-primary-400 text-sm transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New inspiration
        </button>
      </div>
    </div>
  )
}