'use client'

import { useEffect, useState } from 'react'

const quotes = [
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "The only way to do great work is to love what you learn.",
    author: "Inspired by Steve Jobs"
  },
  {
    text: "Every accomplishment starts with the decision to try.",
    author: "John F. Kennedy"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  }
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof quotes[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get quote based on day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`
        text-center transition-all duration-1000 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <span className="text-navy-400 text-sm font-medium uppercase tracking-wider">
          Daily Inspiration
        </span>
      </div>
      <blockquote className="max-w-2xl mx-auto">
        <p className="text-xl md:text-2xl text-navy-200 italic leading-relaxed mb-3">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="text-primary-400 font-medium">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  )
}