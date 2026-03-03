'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The only way to do great work is to love what you learn.", author: "Inspired by Steve Jobs" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The only person who is educated is the one who has learned how to learn.", author: "Carl Rogers" },
]

export default function DailyMotivation() {
  const [quote, setQuote] = useState<typeof motivationalQuotes[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a quote based on the day of the year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const quoteIndex = dayOfYear % motivationalQuotes.length
    setQuote(motivationalQuotes[quoteIndex] ?? motivationalQuotes[0])
    
    // Delay animation for visual effect
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/30
        border border-primary-500/20
        transition-all duration-700 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">💡</span>
          <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
            Daily Inspiration
          </span>
        </div>
        
        <blockquote className="text-lg text-navy-200 italic leading-relaxed mb-3">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        
        <cite className="text-sm text-navy-400 not-italic">
          — {quote.author}
        </cite>
      </div>
    </div>
  )
}