'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random quote based on the day
    const today = new Date().getDate()
    const quoteIndex = today % quotes.length
    const selectedQuote = quotes[quoteIndex]
    if (selectedQuote) {
      setQuote(selectedQuote)
    }
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-2xl border border-primary-500/20">
        {/* Quote mark decoration */}
        <span className="absolute top-2 left-4 text-6xl text-primary-500/20 font-serif leading-none">
          "
        </span>
        
        <blockquote className="relative z-10 pl-6">
          <p className="text-lg text-navy-200 italic mb-3">
            {quote.text}
          </p>
          <footer className="text-primary-400 font-medium">
            — {quote.author}
          </footer>
        </blockquote>
        
        {/* Sparkle decoration */}
        <span className="absolute top-4 right-4 text-2xl animate-pulse">✨</span>
      </div>
    </div>
  )
}