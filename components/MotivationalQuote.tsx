'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  }
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a random quote based on the day
    const today = new Date()
    const dayIndex = today.getDate() % quotes.length
    setCurrentQuote(quotes[dayIndex])
  }, [])

  const getNewQuote = () => {
    setIsVisible(false)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[randomIndex])
      setIsVisible(true)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-950 border border-primary-500/20 p-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💡</span>
          <span className="text-sm font-medium text-primary-400 uppercase tracking-wider">Daily Inspiration</span>
        </div>
        
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 leading-relaxed">
            &ldquo;{currentQuote.text}&rdquo;
          </blockquote>
          <cite className="text-navy-400 not-italic">— {currentQuote.author}</cite>
        </div>
        
        <button
          onClick={getNewQuote}
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors group"
        >
          <svg 
            className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Get new inspiration
        </button>
      </div>
    </div>
  )
}