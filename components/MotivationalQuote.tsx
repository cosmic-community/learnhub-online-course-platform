'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuote(prev => (prev + 1) % quotes.length)
        setIsVisible(true)
      }, 500)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const quote = quotes[currentQuote]
  if (!quote) return null

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-xl" />
      <div
        className={`relative p-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="text-4xl mb-3 text-center">💡</div>
        <blockquote className="text-center">
          <p className="text-lg text-navy-100 italic mb-3">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="text-sm text-navy-400">
            — {quote.author}
          </footer>
        </blockquote>
      </div>
      
      {/* Quote navigation dots */}
      <div className="flex justify-center gap-1.5 pb-4">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                setCurrentQuote(i)
                setIsVisible(true)
              }, 300)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentQuote
                ? 'bg-primary-500 w-4'
                : 'bg-navy-700 hover:bg-navy-600'
            }`}
            aria-label={`Go to quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}