'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(true)
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    // Get quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const initialIndex = dayOfYear % quotes.length
    setQuoteIndex(initialIndex)
    setCurrentQuote(quotes[initialIndex] ?? quotes[0])
  }, [])

  const nextQuote = () => {
    setIsVisible(false)
    setTimeout(() => {
      const newIndex = (quoteIndex + 1) % quotes.length
      setQuoteIndex(newIndex)
      setCurrentQuote(quotes[newIndex] ?? quotes[0])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className="card p-6 relative overflow-hidden group">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">💡</span>
          <h3 className="text-lg font-semibold text-white">Daily Inspiration</h3>
        </div>
        
        <div 
          className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <blockquote className="text-navy-200 text-lg italic mb-3 leading-relaxed">
            "{currentQuote?.text ?? 'Learning is a journey.'}"
          </blockquote>
          <cite className="text-primary-400 text-sm not-italic">
            — {currentQuote?.author ?? 'Unknown'}
          </cite>
        </div>

        <button
          onClick={nextQuote}
          className="mt-4 text-sm text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2 group/btn"
        >
          <span>New quote</span>
          <svg 
            className="w-4 h-4 transition-transform group-hover/btn:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}