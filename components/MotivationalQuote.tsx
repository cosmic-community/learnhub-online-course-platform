'use client'

import { useEffect, useState } from 'react'

const quotes = [
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Tell me and I forget, teach me and I may remember, involve me and I learn.", author: "Benjamin Franklin" },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a random starting quote based on the current hour
    const hour = new Date().getHours()
    setCurrentQuote(hour % quotes.length)

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
        setIsVisible(true)
      }, 500)
    }, 10000) // Change quote every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const quote = quotes[currentQuote]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-800 p-6">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative">
        <svg 
          className="w-8 h-8 text-primary-500/50 mb-2" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <p className="text-lg text-navy-200 italic mb-3 leading-relaxed">
            "{quote?.text}"
          </p>
          <p className="text-sm text-primary-400 font-medium">
            — {quote?.author}
          </p>
        </div>
      </div>
    </div>
  )
}