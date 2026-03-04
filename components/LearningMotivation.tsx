'use client'

import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
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
    text: "The only person who is educated is the one who has learned how to learn and change.",
    author: "Carl Rogers"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
    author: "Abigail Adams"
  }
]

const greetings = [
  { time: [5, 12], message: "Good morning", emoji: "🌅" },
  { time: [12, 17], message: "Good afternoon", emoji: "☀️" },
  { time: [17, 21], message: "Good evening", emoji: "🌆" },
  { time: [21, 5], message: "Burning the midnight oil", emoji: "🌙" }
]

function getGreeting(): { message: string; emoji: string } {
  const hour = new Date().getHours()
  for (const greeting of greetings) {
    const [start, end] = greeting.time
    if (start < end) {
      if (hour >= start && hour < end) return greeting
    } else {
      if (hour >= start || hour < end) return greeting
    }
  }
  return { message: "Hello", emoji: "👋" }
}

function getStreakFromStorage(): number {
  if (typeof window === 'undefined') return 0
  const data = localStorage.getItem('learnhub-streak')
  if (!data) return 0
  
  try {
    const { streak, lastVisit } = JSON.parse(data)
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastVisit === today) {
      return streak
    } else if (lastVisit === yesterday) {
      return streak // Will be incremented
    } else {
      return 0 // Streak broken
    }
  } catch {
    return 0
  }
}

function updateStreak(): number {
  if (typeof window === 'undefined') return 0
  
  const data = localStorage.getItem('learnhub-streak')
  const today = new Date().toDateString()
  
  if (!data) {
    localStorage.setItem('learnhub-streak', JSON.stringify({ streak: 1, lastVisit: today }))
    return 1
  }
  
  try {
    const { streak, lastVisit } = JSON.parse(data)
    
    if (lastVisit === today) {
      return streak // Already counted today
    }
    
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const newStreak = lastVisit === yesterday ? streak + 1 : 1
    
    localStorage.setItem('learnhub-streak', JSON.stringify({ streak: newStreak, lastVisit: today }))
    return newStreak
  } catch {
    localStorage.setItem('learnhub-streak', JSON.stringify({ streak: 1, lastVisit: today }))
    return 1
  }
}

export default function LearningMotivation() {
  const [mounted, setMounted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [quote, setQuote] = useState(quotes[0])
  const [greeting, setGreeting] = useState({ message: "Hello", emoji: "👋" })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Set greeting based on time
    setGreeting(getGreeting())
    
    // Update streak
    const currentStreak = updateStreak()
    setStreak(currentStreak)
    
    // Pick a random quote for today (consistent throughout the day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])
    
    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  if (!mounted) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-40 animate-pulse bg-navy-800/50 rounded-2xl" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Greeting Card */}
          <div className="card p-6 bg-gradient-to-br from-navy-800/80 to-navy-900/80 border-navy-700/50 group hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className="text-4xl animate-bounce-slow">{greeting.emoji}</div>
              <div>
                <p className="text-navy-400 text-sm">Welcome back</p>
                <h3 className="text-xl font-bold text-white">{greeting.message}!</h3>
                <p className="text-navy-300 text-sm mt-1">Ready to learn something new?</p>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/80 border-primary-500/20 group hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-navy-400 text-sm flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                  Daily Streak
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-bold text-white tabular-nums">{streak}</span>
                  <span className="text-navy-300 text-sm">{streak === 1 ? 'day' : 'days'}</span>
                </div>
                <p className="text-navy-400 text-xs mt-2">
                  {streak >= 7 ? "🔥 You're on fire!" : streak >= 3 ? "🌟 Keep it up!" : "🚀 Let's build momentum!"}
                </p>
              </div>
              <div className="relative">
                <div className="text-5xl">{streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '🎯'}</div>
                {streak >= 7 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping" />
                )}
              </div>
            </div>
            {/* Streak Progress */}
            <div className="mt-4 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                    i < streak % 7 || (streak >= 7 && i < 7)
                      ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                      : 'bg-navy-700'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
            <p className="text-navy-500 text-xs mt-2 text-center">
              {streak >= 7 ? 'Week completed! 🎉' : `${7 - (streak % 7)} days to weekly goal`}
            </p>
          </div>

          {/* Quote Card */}
          <div className="card p-6 bg-gradient-to-br from-navy-800/80 to-navy-900/80 border-navy-700/50 group hover:scale-[1.02] transition-transform duration-300">
            <div className="flex flex-col h-full">
              <div className="text-primary-400 text-2xl mb-2">"</div>
              <p className="text-navy-200 italic flex-1 text-sm leading-relaxed">
                {quote.text}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-navy-400 text-xs">— {quote.author}</p>
                <span className="text-xs text-navy-500">Quote of the Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}