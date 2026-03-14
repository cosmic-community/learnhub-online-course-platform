'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(QUOTES[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick a random quote based on the day
    const dayIndex = new Date().getDate() % QUOTES.length
    setQuote(QUOTES[dayIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-900 to-primary-900/20 border border-navy-700 p-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="text-6xl text-primary-500/20 font-serif leading-none mb-2">"</div>
        <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-4 -mt-8 pl-4">
          {quote.text}
        </blockquote>
        <p className="text-navy-400 text-lg pl-4">— {quote.author}</p>
      </div>
      
      {/* Daily Inspiration Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-navy-800/80 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-sm">✨</span>
        <span className="text-xs text-navy-300 font-medium">Daily Inspiration</span>
      </div>
    </div>
  )
}