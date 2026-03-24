'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get daily quote based on date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
  }, [])

  if (!isVisible) return null

  return (
    <div className="relative card p-6 bg-gradient-to-br from-navy-900/50 via-navy-800/30 to-primary-900/20 border-navy-700">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-navy-500 hover:text-navy-300 transition-colors"
        aria-label="Dismiss quote"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex gap-4">
        <div className="text-4xl text-primary-400">💡</div>
        <div>
          <p className="text-white text-lg italic mb-2">"{quote.text}"</p>
          <p className="text-navy-400 text-sm">— {quote.author}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-navy-700 flex items-center justify-between">
        <span className="text-xs text-navy-500">Daily Inspiration</span>
        <span className="text-xs text-navy-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}