'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" }
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Pick a random quote on mount based on the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(quotes[dayOfYear % quotes.length])
  }, [])

  const getNewQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const currentIndex = quotes.indexOf(quote)
      const nextIndex = (currentIndex + 1) % quotes.length
      setQuote(quotes[nextIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div 
      className="card p-6 cursor-pointer group relative overflow-hidden"
      onClick={getNewQuote}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 text-[120px] leading-none text-navy-800/30 font-serif select-none">
        "
      </div>
      
      <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl flex-shrink-0">
            💡
          </div>
          <div>
            <p className="text-navy-200 italic text-lg leading-relaxed mb-2">
              "{quote.text}"
            </p>
            <p className="text-primary-400 font-medium">
              — {quote.author}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-xs text-navy-500 group-hover:text-navy-400 transition-colors">
          Click for another quote ✨
        </span>
      </div>
    </div>
  )
}