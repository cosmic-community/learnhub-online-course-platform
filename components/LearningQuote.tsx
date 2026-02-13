'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    emoji: "🎸"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    emoji: "🌟"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "📖"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
    emoji: "🔥"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    emoji: "💡"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
    emoji: "🚗"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    emoji: "🌱"
  }
]

export default function LearningQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a "random" quote based on the day so it changes daily but stays consistent during the day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % quotes.length
    setCurrentQuote(quotes[quoteIndex] ?? quotes[0])
  }, [])

  const getNextQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = quotes.findIndex(q => q.text === currentQuote.text)
      const nextIndex = (currentIndex + 1) % quotes.length
      setCurrentQuote(quotes[nextIndex] ?? quotes[0])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/5 via-primary-400/10 to-primary-500/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -top-6 left-8 text-6xl text-primary-500/20">"</div>
          
          <div 
            className={`text-center py-8 transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="text-4xl mb-4">{currentQuote.emoji}</div>
            <blockquote className="text-xl md:text-2xl text-navy-200 italic mb-4 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-navy-400 not-italic">— {currentQuote.author}</cite>
          </div>
          
          <div className="absolute -bottom-2 right-8 text-6xl text-primary-500/20 rotate-180">"</div>
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={getNextQuote}
            className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-primary-400 transition-colors group"
          >
            <span>Get inspired</span>
            <svg 
              className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}