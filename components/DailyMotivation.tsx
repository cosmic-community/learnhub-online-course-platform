'use client'

import { useState, useEffect } from 'react'

const motivationalQuotes = [
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    emoji: "🎸"
  },
  {
    quote: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
    emoji: "🔥"
  },
  {
    quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "📚"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    emoji: "🌟"
  },
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    emoji: "🎯"
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci",
    emoji: "🧠"
  },
  {
    quote: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    emoji: "💎"
  },
  {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    emoji: "✨"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    emoji: "🚀"
  },
  {
    quote: "The only person who is educated is the one who has learned how to learn and change.",
    author: "Carl Rogers",
    emoji: "🦋"
  },
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    emoji: "💪"
  },
  {
    quote: "Every accomplishment starts with the decision to try.",
    author: "John F. Kennedy",
    emoji: "🌈"
  }
]

export default function DailyMotivation() {
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const quoteIndex = dayOfYear % motivationalQuotes.length
    setQuote(motivationalQuotes[quoteIndex])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/50 border border-primary-500/20 p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-600/5 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{quote.emoji}</div>
          <div>
            <p className="text-white text-lg font-medium leading-relaxed mb-3 italic">
              "{quote.quote}"
            </p>
            <p className="text-primary-400 text-sm font-medium">
              — {quote.author}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-navy-800/50 flex items-center justify-between">
          <span className="text-navy-500 text-xs uppercase tracking-wider">Daily Inspiration</span>
          <span className="text-navy-500 text-xs">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}