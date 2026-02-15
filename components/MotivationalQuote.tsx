'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(QUOTES[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Select a random quote based on the day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % QUOTES.length
    setQuote(QUOTES[quoteIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative">
        <div className="absolute -top-4 -left-2 text-6xl text-primary-500/20 font-serif">"</div>
        <blockquote className="pl-8">
          <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed">
            {quote.text}
          </p>
          <footer className="mt-4 text-navy-400">
            — <cite className="not-italic font-medium text-primary-400">{quote.author}</cite>
          </footer>
        </blockquote>
        <div className="absolute -bottom-4 -right-2 text-6xl text-primary-500/20 font-serif rotate-180">"</div>
      </div>
    </div>
  )
}