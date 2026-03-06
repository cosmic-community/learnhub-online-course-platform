'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

function getRandomQuote() {
  const today = new Date().toDateString()
  // Use date as seed for consistent daily quote
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  return motivationalQuotes[seed % motivationalQuotes.length]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
  const diffTime = currentDate.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const quote = getRandomQuote()

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisit)
      
      if (!isSameDay(lastVisit, today)) {
        // New day visit
        if (isConsecutiveDay(lastVisit, today)) {
          // Consecutive day - increase streak!
          data.currentStreak += 1
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
        } else {
          // Streak broken
          data.currentStreak = 1
        }
        data.totalVisits += 1
        data.lastVisit = today.toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today.toISOString(),
        totalVisits: 1,
        longestStreak: 1,
      }
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Show quote after a short delay
    setTimeout(() => setShowQuote(true), 500)
  }, [])

  if (!streakData) {
    return null
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🌟'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '⚡'
    return '✨'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary learner!"
    if (streak >= 14) return "Two weeks strong!"
    if (streak >= 7) return "One week streak!"
    if (streak >= 3) return "Keep it up!"
    return "Great start!"
  }

  return (
    <div className="mb-8">
      {/* Streak Badge */}
      <div 
        className={`inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 mb-4 transition-all duration-500 ${
          isAnimating ? 'scale-110 shadow-lg shadow-orange-500/30' : ''
        }`}
      >
        <span className={`text-2xl ${isAnimating ? 'animate-bounce' : ''}`}>
          {getStreakEmoji(streakData.currentStreak)}
        </span>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-orange-400">
              {streakData.currentStreak} Day Streak
            </span>
            {isAnimating && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-pulse">
                +1!
              </span>
            )}
          </div>
          <span className="text-sm text-orange-300/70">
            {getStreakMessage(streakData.currentStreak)}
          </span>
        </div>
        {streakData.longestStreak > streakData.currentStreak && (
          <div className="text-xs text-navy-400 border-l border-navy-700 pl-3 ml-1">
            Best: {streakData.longestStreak} days
          </div>
        )}
      </div>

      {/* Daily Quote */}
      <div 
        className={`transition-all duration-700 ${
          showQuote ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <p className="text-navy-300 italic text-sm max-w-lg mx-auto">
          &ldquo;{quote?.text}&rdquo;
          <span className="text-navy-500 not-italic ml-2">— {quote?.author}</span>
        </p>
      </div>
    </div>
  )
}