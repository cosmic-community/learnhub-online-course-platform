'use client'

import { useState, useEffect } from 'react'

interface Quote {
  text: string
  author: string
  emoji: string
}

const quotes: Quote[] = [
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    emoji: "🎁"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    emoji: "🌟"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    emoji: "💎"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
    emoji: "🔥"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "🚀"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    emoji: "🧠"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    emoji: "🌱"
  },
  {
    text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    author: "Pelé",
    emoji: "⚽"
  },
  {
    text: "I am still learning.",
    author: "Michelangelo (at age 87)",
    emoji: "🎨"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.",
    author: "Henry Ford",
    emoji: "🌈"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    emoji: "💡"
  },
  {
    text: "The only thing that interferes with my learning is my education.",
    author: "Albert Einstein",
    emoji: "🔬"
  }
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a random quote based on the current hour to change periodically
    const hourSeed = new Date().getHours()
    const daySeed = new Date().getDate()
    const index = (hourSeed + daySeed) % quotes.length
    setQuote(quotes[index])
    
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (!quote) {
    return (
      <div className="animate-pulse h-24 bg-navy-800/50 rounded-xl" />
    )
  }

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-4xl">{quote.emoji}</div>
        <div className="flex-1">
          <blockquote className="text-lg md:text-xl text-navy-200 italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <cite className="block mt-2 text-sm text-primary-400 not-italic">
            — {quote.author}
          </cite>
        </div>
        <div className="hidden md:flex flex-shrink-0 items-center gap-1 text-navy-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Daily inspiration</span>
        </div>
      </div>
    </div>
  )
}