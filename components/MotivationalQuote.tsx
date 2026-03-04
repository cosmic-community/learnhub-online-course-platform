'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin"
  },
  {
    text: "The only person who is educated is the one who has learned how to learn and change.",
    author: "Carl Rogers"
  }
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent daily quote based on date
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={`text-center transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-2xl">💡</span>
        <span className="text-xs uppercase tracking-wider text-primary-400 font-semibold">
          Daily Inspiration
        </span>
      </div>
      <blockquote className="text-lg md:text-xl text-white font-medium italic">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <cite className="block mt-3 text-navy-400 text-sm not-italic">
        — {quote.author}
      </cite>
    </div>
  )
}