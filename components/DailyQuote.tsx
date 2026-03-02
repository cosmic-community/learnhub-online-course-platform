'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
  emoji: string
}

const quotes: Quote[] = [
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King", emoji: "🎸" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats", emoji: "🔥" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss", emoji: "📚" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", emoji: "🌟" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert", emoji: "💡" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins", emoji: "🎵" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford", emoji: "🚗" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers", emoji: "🔄" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", emoji: "⚡" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams", emoji: "🎯" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", emoji: "🌱" },
  { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma", emoji: "🏆" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", emoji: "❤️" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", emoji: "💪" },
]

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get quote based on day of year for consistency
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    const todaysQuote = quotes[dayOfYear % quotes.length]
    setQuote(todaysQuote)
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`
        text-center transition-all duration-700 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-2xl">{quote.emoji}</span>
        <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">
          Daily Inspiration
        </span>
        <span className="text-2xl">{quote.emoji}</span>
      </div>
      <blockquote className="text-lg sm:text-xl text-white/90 italic font-light">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <cite className="text-navy-400 text-sm mt-2 block not-italic">
        — {quote.author}
      </cite>
    </div>
  )
}