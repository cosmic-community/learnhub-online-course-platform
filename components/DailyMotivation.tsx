'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { quote: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes" },
]

export default function DailyMotivation() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % motivationalQuotes.length
    setCurrentQuote(motivationalQuotes[quoteIndex] ?? motivationalQuotes[0])
    
    // Trigger entrance animation
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`relative bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-navy-900/50 border-b border-primary-500/20 overflow-hidden transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0'}`}
    >
      {/* Animated background sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary-400/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-primary-300/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-2/3 left-3/4 w-1.5 h-1.5 bg-primary-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0 animate-bounce" style={{ animationDuration: '2s' }}>💡</span>
            <div className="min-w-0">
              <p className="text-sm sm:text-base text-navy-200 italic truncate sm:whitespace-normal">
                &ldquo;{currentQuote.quote}&rdquo;
              </p>
              <p className="text-xs text-primary-400 mt-0.5">— {currentQuote.author}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 text-navy-400 hover:text-white transition-colors rounded-full hover:bg-navy-800/50"
            aria-label="Dismiss motivation banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}