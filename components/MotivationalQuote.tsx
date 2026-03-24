'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin"
  }
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Get a random quote based on the day (so it changes daily)
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem('quote-date')
    const storedIndex = localStorage.getItem('quote-index')
    
    let index = 0
    if (storedDate === today && storedIndex) {
      index = parseInt(storedIndex, 10)
    } else {
      index = Math.floor(Math.random() * quotes.length)
      localStorage.setItem('quote-date', today)
      localStorage.setItem('quote-index', index.toString())
    }
    
    setCurrentQuote(quotes[index])
  }, [])

  const handleNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * quotes.length)
      setCurrentQuote(quotes[newIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <span className="text-3xl">💡</span>
      <div 
        className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}`}
      >
        <p className="text-navy-200 italic text-lg">
          &ldquo;{currentQuote.text}&rdquo;
        </p>
        <p className="text-primary-400 text-sm mt-1">
          — {currentQuote.author}
        </p>
      </div>
      <button 
        onClick={handleNewQuote}
        className="text-navy-500 hover:text-primary-400 transition-colors p-2 rounded-full hover:bg-navy-800/50"
        title="Get new quote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}