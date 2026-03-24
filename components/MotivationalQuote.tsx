'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(QUOTES[0])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Use the day of year to get a consistent quote for the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(QUOTES[dayOfYear % QUOTES.length])
  }, [])
  
  if (!mounted) {
    return null
  }
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 to-navy-900/40 border border-primary-500/20 p-6">
      <div className="absolute top-4 left-4 text-6xl text-primary-500/20 font-serif">"</div>
      <div className="relative z-10">
        <p className="text-lg text-navy-200 italic mb-3 pl-6">
          {quote.text}
        </p>
        <p className="text-sm text-primary-400 font-medium text-right">
          — {quote.author}
        </p>
      </div>
      <div className="absolute bottom-4 right-4 text-6xl text-primary-500/20 font-serif rotate-180">"</div>
    </div>
  )
}