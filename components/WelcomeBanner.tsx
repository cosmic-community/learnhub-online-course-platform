'use client'

import { useState, useEffect } from 'react'

// Curated quotes about learning, programming, and growth
const learningQuotes = [
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The more I learn, the more I realize how much I don't know.", author: "Albert Einstein" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Every expert was once a beginner.", author: "Rutherford B. Hayes" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Happy late-night learning'
}

function getDailyQuote() {
  // Use date as seed for consistent daily quote
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % learningQuotes.length
  return learningQuotes[index]
}

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasClosedToday, setHasClosedToday] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)

  useEffect(() => {
    // Check if user has closed the banner today
    const closedDate = localStorage.getItem('welcome-banner-closed')
    const today = new Date().toDateString()
    
    if (closedDate === today) {
      setHasClosedToday(true)
      return
    }

    // Set greeting and quote
    setGreeting(getGreeting())
    setQuote(getDailyQuote())
    
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    const today = new Date().toDateString()
    localStorage.setItem('welcome-banner-closed', today)
    setTimeout(() => setHasClosedToday(true), 300)
  }

  if (hasClosedToday || !quote) return null

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
      }`}
    >
      <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-navy-900/50 border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Animated sparkle emoji */}
              <div className="flex-shrink-0 text-2xl animate-bounce">✨</div>
              
              <div className="min-w-0 flex-1">
                <p className="text-primary-300 font-medium text-sm sm:text-base">
                  {greeting}, learner!
                </p>
                <p className="text-navy-200 text-sm sm:text-base truncate sm:whitespace-normal">
                  <span className="italic">&ldquo;{quote.text}&rdquo;</span>
                  <span className="text-navy-400 ml-2">— {quote.author}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-2 text-navy-400 hover:text-white hover:bg-navy-800/50 rounded-lg transition-colors"
              aria-label="Close welcome banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}