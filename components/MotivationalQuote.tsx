'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Pick a random quote on mount based on the day
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    setQuote(quotes[dayOfYear % quotes.length])
  }, [])

  const getNewQuote = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      const currentIndex = quotes.indexOf(quote)
      const nextIndex = (currentIndex + 1) % quotes.length
      setQuote(quotes[nextIndex])
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="relative group cursor-pointer" onClick={getNewQuote}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
      <div className="relative card p-8 text-center border-primary-500/20 hover:border-primary-500/40 transition-colors">
        <div className="text-4xl mb-4">💡</div>
        <blockquote
          className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <p className="text-lg text-navy-200 italic mb-3">&ldquo;{quote.text}&rdquo;</p>
          <cite className="text-primary-400 text-sm not-italic">— {quote.author}</cite>
        </blockquote>
        <p className="text-navy-500 text-xs mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          Click for another quote
        </p>
      </div>
    </div>
  )
}