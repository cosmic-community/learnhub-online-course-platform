'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof quotes[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get today's quote based on date (consistent throughout the day)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-800 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative quotes */}
      <div className="absolute top-2 left-4 text-6xl text-primary-500/20 font-serif">"</div>
      <div className="absolute bottom-2 right-4 text-6xl text-primary-500/20 font-serif rotate-180">"</div>

      <div className="relative z-10">
        <p className="text-lg sm:text-xl text-white italic mb-3 leading-relaxed">
          {quote.text}
        </p>
        <p className="text-sm text-primary-400 font-medium">
          — {quote.author}
        </p>
      </div>

      {/* Sparkle decoration */}
      <div className="absolute top-4 right-8 text-yellow-400/50 sparkle" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute bottom-8 left-8 text-purple-400/50 sparkle" style={{ animationDelay: '1s' }}>✦</div>
    </div>
  )
}