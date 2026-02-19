'use client'

import { useState, useEffect } from 'react'

const quotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The more I read, the more I acquire, the more certain I am that I know nothing.", author: "Voltaire" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The only thing that interferes with my learning is my education.", author: "Albert Einstein" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [isVisible, setIsVisible] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Get today's quote based on day of year for consistency
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const quoteIndex = dayOfYear % quotes.length
    setQuote(quotes[quoteIndex])

    // Calculate learning streak from localStorage
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0', 10)
    const todayStr = today.toDateString()

    if (lastVisit === todayStr) {
      // Same day visit
      setStreak(currentStreak)
    } else {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak!
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
      } else {
        // Streak broken - reset to 1
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
      }
      localStorage.setItem('learnhub-last-visit', todayStr)
    }

    // Trigger animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      {/* Learning Streak Badge */}
      {streak > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4 animate-pulse-subtle">
          <span className="text-2xl">🔥</span>
          <span className="text-amber-400 font-semibold">
            {streak} Day{streak !== 1 ? 's' : ''} Learning Streak!
          </span>
          {streak >= 7 && <span className="text-xl">⭐</span>}
          {streak >= 30 && <span className="text-xl">🏆</span>}
        </div>
      )}
      
      {/* Daily Quote */}
      <div className="relative">
        <div className="absolute -left-4 -top-2 text-4xl text-primary-500/30">"</div>
        <p className="text-navy-300 italic text-lg px-4">
          {quote.text}
        </p>
        <p className="text-primary-400 text-sm mt-2">— {quote.author}</p>
        <div className="absolute -right-4 -bottom-2 text-4xl text-primary-500/30 rotate-180">"</div>
      </div>
    </div>
  )
}