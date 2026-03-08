'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn.", author: "Carl Rogers" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof QUOTES[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-daily-quote')
    
    if (stored) {
      const { date, quoteIndex } = JSON.parse(stored)
      if (date === today) {
        setQuote(QUOTES[quoteIndex])
      } else {
        const newIndex = Math.floor(Math.random() * QUOTES.length)
        localStorage.setItem('learnhub-daily-quote', JSON.stringify({ date: today, quoteIndex: newIndex }))
        setQuote(QUOTES[newIndex])
      }
    } else {
      const newIndex = Math.floor(Math.random() * QUOTES.length)
      localStorage.setItem('learnhub-daily-quote', JSON.stringify({ date: today, quoteIndex: newIndex }))
      setQuote(QUOTES[newIndex])
    }
    
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!quote) return null

  return (
    <div 
      className="text-center py-8 transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative">
          <span className="absolute -top-4 -left-2 text-6xl text-primary-500/20 font-serif">"</span>
          <p className="text-lg sm:text-xl text-navy-200 italic leading-relaxed">
            {quote.text}
          </p>
          <span className="absolute -bottom-8 -right-2 text-6xl text-primary-500/20 font-serif rotate-180">"</span>
        </div>
        <p className="mt-4 text-sm text-primary-400 font-medium">
          — {quote.author}
        </p>
      </div>
    </div>
  )
}