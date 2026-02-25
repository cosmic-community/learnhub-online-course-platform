'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<typeof QUOTES[0] | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get today's date to show consistent quote for the day
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('learnhub-quote-date')
    const storedIndex = localStorage.getItem('learnhub-quote-index')
    
    let quoteIndex: number
    
    if (storedDate === today && storedIndex) {
      quoteIndex = parseInt(storedIndex, 10)
    } else {
      quoteIndex = Math.floor(Math.random() * QUOTES.length)
      localStorage.setItem('learnhub-quote-date', today)
      localStorage.setItem('learnhub-quote-index', quoteIndex.toString())
    }
    
    setQuote(QUOTES[quoteIndex] ?? QUOTES[0] ?? null)
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative">
        {/* Decorative quote marks */}
        <span className="absolute -top-4 -left-2 text-6xl text-primary-500/10 font-serif">"</span>
        <blockquote className="relative z-10 text-lg sm:text-xl text-navy-200 italic leading-relaxed pl-4">
          {quote.text}
        </blockquote>
        <p className="mt-3 text-primary-400 font-medium pl-4">— {quote.author}</p>
      </div>
    </div>
  )
}