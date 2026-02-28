'use client'

import { useEffect, useState } from 'react'

const quotes = [
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Pick a quote based on the current hour to change throughout the day
    const hour = new Date().getHours()
    const quoteIndex = hour % quotes.length
    setCurrentQuote(quotes[quoteIndex])
  }, [])

  const nextQuote = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    setTimeout(() => {
      const currentIndex = quotes.findIndex(q => q.text === currentQuote.text)
      const nextIndex = (currentIndex + 1) % quotes.length
      setCurrentQuote(quotes[nextIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <section className="py-12 bg-navy-900/50 border-y border-navy-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`text-center transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
        >
          <div className="text-4xl mb-4">💡</div>
          <blockquote className="text-xl md:text-2xl text-navy-200 italic mb-4">
            &ldquo;{currentQuote.text}&rdquo;
          </blockquote>
          <cite className="text-primary-400 not-italic font-medium">
            — {currentQuote.author}
          </cite>
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={nextQuote}
            className="text-navy-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
            disabled={isAnimating}
          >
            <span>Another quote</span>
            <svg 
              className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}