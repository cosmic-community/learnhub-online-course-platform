'use client'

import { useState, useEffect } from 'react'

const QUOTES = {
  morning: [
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Every morning brings new potential.", author: "Unknown" },
    { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  ],
  afternoon: [
    { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  ],
  evening: [
    { text: "Never stop learning because life never stops teaching.", author: "Unknown" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  ],
}

export default function DailyQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    let timeOfDay: 'morning' | 'afternoon' | 'evening'
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning'
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon'
    } else {
      timeOfDay = 'evening'
    }

    const quotes = QUOTES[timeOfDay]
    // Use date as seed for consistent daily quote
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % quotes.length
    
    setQuote(quotes[quoteIndex])
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!quote) return null

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <blockquote className="relative">
        <div className="absolute -left-2 -top-2 text-4xl text-primary-500/20">"</div>
        <p className="text-navy-300 italic text-lg px-6">
          {quote.text}
        </p>
        <footer className="mt-2 text-navy-500 text-sm">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  )
}