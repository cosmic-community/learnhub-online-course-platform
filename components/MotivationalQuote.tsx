'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get today's quote based on the day of the year
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    const quoteIndex = dayOfYear % quotes.length
    
    setQuote(quotes[quoteIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="text-xl">💡</span>
        <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">Quote of the Day</span>
        <span className="text-xl">💡</span>
      </div>
      <blockquote className="text-white text-lg md:text-xl font-medium italic">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <cite className="text-navy-400 text-sm mt-2 block not-italic">
        — {quote.author}
      </cite>
    </div>
  )
}