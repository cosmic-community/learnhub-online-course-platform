'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The only way to do great work is to love what you learn.",
    author: "Inspired by Steve Jobs",
    emoji: "💡"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats",
    emoji: "🔥"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    emoji: "✨"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    emoji: "🌟"
  },
  {
    text: "The more that you read, the more things you will know.",
    author: "Dr. Seuss",
    emoji: "📚"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty.",
    author: "Henry Ford",
    emoji: "🚀"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    emoji: "🎯"
  },
  {
    text: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb",
    emoji: "💎"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
    emoji: "🎓"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    emoji: "🧠"
  }
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Select a random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex] ?? quotes[0])
    
    // Fade in
    setTimeout(() => setIsVisible(true), 100)

    // Change quote every 30 seconds
    const interval = setInterval(() => {
      setIsChanging(true)
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * quotes.length)
        setCurrentQuote(quotes[newIndex] ?? quotes[0])
        setIsChanging(false)
      }, 500)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`text-center py-6 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${isChanging ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-3xl">{currentQuote.emoji}</span>
        <span className="text-navy-500 text-sm uppercase tracking-wider font-medium">
          Daily Inspiration
        </span>
        <span className="text-3xl">{currentQuote.emoji}</span>
      </div>
      <blockquote className="text-xl md:text-2xl text-navy-200 font-light italic max-w-3xl mx-auto leading-relaxed">
        "{currentQuote.text}"
      </blockquote>
      <cite className="block mt-3 text-primary-400 font-medium not-italic">
        — {currentQuote.author}
      </cite>
    </div>
  )
}