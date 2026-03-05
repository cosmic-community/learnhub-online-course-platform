'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Pick random quote on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
    
    setTimeout(() => setIsVisible(true), 300)
    
    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        const newQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote(newQuote)
        setIsChanging(false)
      }, 500)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className={`card p-8 relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="text-4xl mb-4 opacity-30">"</div>
        <p 
          className={`text-xl text-navy-200 italic mb-4 transition-all duration-500 ${
            isChanging ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
        >
          {quote.text}
        </p>
        <p 
          className={`text-primary-400 font-medium transition-all duration-500 ${
            isChanging ? 'opacity-0' : 'opacity-100'
          }`}
        >
          — {quote.author}
        </p>
      </div>
      
      {/* Refresh hint */}
      <div className="absolute bottom-4 right-4 text-navy-600 text-xs">
        ✨ New quote every 10s
      </div>
    </div>
  )
}