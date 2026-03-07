'use client'

import { useEffect, useState } from 'react'

const inspirationalQuotes = [
  {
    quote: "The only way to do great work is to love what you learn.",
    author: "Inspired by Steve Jobs",
    emoji: "💡"
  },
  {
    quote: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb",
    emoji: "📖"
  },
  {
    quote: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    emoji: "🎸"
  },
  {
    quote: "Every master was once a disaster. Keep learning!",
    author: "T. Harv Eker",
    emoji: "🚀"
  },
  {
    quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "🌟"
  },
  {
    quote: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats",
    emoji: "🔥"
  },
  {
    quote: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
    emoji: "🧠"
  },
]

export default function DailyInspiration() {
  const [quote, setQuote] = useState(inspirationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a quote based on the day of year for consistency
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    const quoteIndex = dayOfYear % inspirationalQuotes.length
    const selectedQuote = inspirationalQuotes[quoteIndex]
    if (selectedQuote) {
      setQuote(selectedQuote)
    }
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/30 border border-primary-500/20 p-8 md:p-10 overflow-hidden transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Quote icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center text-3xl md:text-4xl">
                {quote?.emoji}
              </div>
            </div>
            
            {/* Quote content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-start gap-2 mb-2">
                <svg className="w-6 h-6 text-primary-500/40 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-lg md:text-xl text-white font-medium italic">
                  {quote?.quote}
                </blockquote>
              </div>
              <cite className="text-navy-400 text-sm not-italic">
                — {quote?.author}
              </cite>
            </div>
            
            {/* Daily badge */}
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-800/50 border border-navy-700 text-xs text-navy-300">
                <svg className="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Daily Inspiration
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}