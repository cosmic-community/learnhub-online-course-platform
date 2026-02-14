'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not a spectator sport.", author: "D. Blocher" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { text: "The more I learn, the more I realize how much I don't know.", author: "Albert Einstein" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a quote based on the day
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const quoteOfDay = quotes[dayOfYear % quotes.length]
    if (quoteOfDay) {
      setQuote(quoteOfDay)
    }
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-800 p-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="text-4xl mb-4 opacity-50">💡</div>
        <blockquote className="text-xl text-white font-medium mb-4 leading-relaxed">
          "{quote.text}"
        </blockquote>
        <cite className="text-navy-400 not-italic">— {quote.author}</cite>
      </div>

      {/* Daily inspiration label */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-navy-800/50 rounded-full">
        <span className="text-xs text-navy-400">Daily Inspiration ✨</span>
      </div>
    </div>
  )
}