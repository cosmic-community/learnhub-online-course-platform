'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
  { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Pick a random quote based on the day
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex] ?? quotes[0])
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-primary-400">✨</span>
        <span className="text-xs uppercase tracking-wider text-navy-400">Daily Inspiration</span>
        <span className="text-primary-400">✨</span>
      </div>
      <blockquote className="text-lg md:text-xl text-navy-200 italic">
        "{quote.text}"
      </blockquote>
      <cite className="text-sm text-navy-400 mt-2 block not-italic">
        — {quote.author}
      </cite>
    </div>
  )
}