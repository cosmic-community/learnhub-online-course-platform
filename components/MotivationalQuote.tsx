'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
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
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  }
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
        setIsVisible(true)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const quote = quotes[currentQuote]

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="text-6xl opacity-30">❝</span>
        </div>
        
        <div 
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <blockquote className="text-xl sm:text-2xl lg:text-3xl text-white font-light italic mb-6 leading-relaxed">
            {quote?.text}
          </blockquote>
          <cite className="text-primary-400 font-medium text-lg not-italic">
            — {quote?.author}
          </cite>
        </div>

        {/* Quote indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  setCurrentQuote(index)
                  setIsVisible(true)
                }, 300)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuote 
                  ? 'bg-primary-400 w-8' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`View quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}