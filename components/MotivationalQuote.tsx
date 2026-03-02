'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more I learn, the more I realize how much I don't know.", author: "Albert Einstein" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only way to do great work is to love what you learn.", author: "Steve Jobs (paraphrased)" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random quote based on the day
    const today = new Date().toDateString()
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const index = Math.abs(hash) % quotes.length
    setQuote(quotes[index] ?? quotes[0])
    
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  return (
    <div 
      className={`relative p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-800 overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="text-4xl mb-3 opacity-30">"</div>
        <p className="text-lg text-navy-200 italic mb-4 leading-relaxed">
          {quote.text}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-gradient-to-r from-primary-500 to-transparent" />
          <span className="text-sm text-primary-400 font-medium">{quote.author}</span>
        </div>
      </div>
    </div>
  )
}