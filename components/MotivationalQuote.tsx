'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof QUOTES[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a deterministic quote based on the day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedQuote = QUOTES[dayOfYear % QUOTES.length]
    setQuote(selectedQuote)
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div className={`
      transition-all duration-1000
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      <div className="relative bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 rounded-2xl p-8 border border-primary-500/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <span className="text-6xl text-primary-500/30 absolute -top-4 -left-2">"</span>
          <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed pl-8 pr-4">
            {quote.text}
          </blockquote>
          <span className="text-6xl text-primary-500/30 absolute -bottom-8 right-0">"</span>
        </div>
        
        <p className="mt-6 text-primary-400 font-medium pl-8">
          — {quote.author}
        </p>
        
        <div className="mt-4 flex items-center gap-2 text-navy-400 text-sm pl-8">
          <span className="text-lg">💡</span>
          <span>Daily inspiration for your learning journey</span>
        </div>
      </div>
    </div>
  )
}