'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie",
    role: "Creator of C"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    role: "Software Engineer"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
    role: "Developer"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    role: "Software Architect"
  },
  {
    text: "Learning to code is learning to create and innovate.",
    author: "Enda Kenny",
    role: "Former PM of Ireland"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    role: "Author & Speaker"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
    role: "Musician"
  },
  {
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    role: "Physicist"
  }
]

export default function InspirationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get a random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])

    // Rotate quotes every 30 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * quotes.length)
        setQuote(quotes[newIndex])
        setIsVisible(true)
      }, 500)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="relative">
        {/* Quote mark decoration */}
        <div className="absolute -top-4 -left-2 text-6xl text-primary-500/20 font-serif">"</div>
        
        <blockquote className="relative pl-6">
          <p className="text-lg text-navy-200 italic leading-relaxed">
            {quote.text}
          </p>
          <footer className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
              {quote.author.charAt(0)}
            </div>
            <div>
              <cite className="text-white font-medium not-italic">{quote.author}</cite>
              <p className="text-navy-400 text-sm">{quote.role}</p>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  )
}