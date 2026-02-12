'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "The only person who is educated is the one who has learned how to learn and change.",
    author: "Carl Rogers"
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  }
]

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get a consistent quote for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 300)
  }, [])

  return (
    <section className={`py-8 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-600/10 border border-navy-700/50 p-8 md:p-10">
          {/* Decorative quote marks */}
          <div className="absolute top-4 left-6 text-6xl text-primary-500/20 font-serif">"</div>
          <div className="absolute bottom-4 right-6 text-6xl text-primary-500/20 font-serif rotate-180">"</div>
          
          {/* Sparkle decorations */}
          <div className="absolute top-4 right-12 text-2xl animate-pulse">✨</div>
          <div className="absolute bottom-6 left-16 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>💫</div>
          
          <div className="relative text-center">
            <p className="text-sm text-primary-400 mb-4 uppercase tracking-wider font-medium">
              💡 Daily Inspiration
            </p>
            <blockquote className="text-xl md:text-2xl text-white font-medium mb-4 leading-relaxed">
              {quote.text}
            </blockquote>
            <cite className="text-navy-400 not-italic">
              — {quote.author}
            </cite>
          </div>
        </div>
      </div>
    </section>
  )
}