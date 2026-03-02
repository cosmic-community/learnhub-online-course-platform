'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Gandhi" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof QUOTES[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a quote based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const selectedQuote = QUOTES[dayOfYear % QUOTES.length]
    setQuote(selectedQuote)
    
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!quote || !isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-navy-900/80 via-primary-900/30 to-navy-900/80 border-y border-navy-800">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
      <div className="max-w-4xl mx-auto px-4 py-6 text-center relative">
        <div className="flex items-center justify-center gap-4">
          <span className="text-2xl opacity-50">💭</span>
          <div>
            <p className="text-navy-200 italic text-lg">"{quote.text}"</p>
            <p className="text-primary-400 text-sm mt-1">— {quote.author}</p>
          </div>
          <span className="text-2xl opacity-50">✨</span>
        </div>
      </div>
    </div>
  )
}