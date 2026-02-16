'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Use the day of year to get a consistent daily quote
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    const dailyQuote = quotes[dayOfYear % quotes.length]
    if (dailyQuote) {
      setQuote(dailyQuote)
    }
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/80 border border-primary-500/20 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/5 rounded-full blur-xl" />
      
      <div className="relative">
        <div className="flex items-start gap-3">
          <span className="text-3xl text-primary-400 opacity-50">"</span>
          <div>
            <p className="text-navy-200 text-lg italic leading-relaxed mb-3">
              {quote.text}
            </p>
            <p className="text-primary-400 text-sm font-medium">
              — {quote.author}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-navy-800/50 flex items-center justify-between">
          <span className="text-xs text-navy-500">Daily inspiration ✨</span>
          <span className="text-xs text-navy-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}