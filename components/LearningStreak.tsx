'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalLessonsCompleted: number
}

const MOTIVATIONAL_QUOTES = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Education is the passport to the future.", author: "Malcolm X" },
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The only way to do great work is to love what you learn.", author: "Anonymous" },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalLessonsCompleted: 0
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0])

  useEffect(() => {
    // Get daily quote based on the day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length])

    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const parsed = JSON.parse(savedData) as StreakData
      const lastVisitDate = new Date(parsed.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      let newStreak = parsed.currentStreak
      
      if (lastVisitDate === today) {
        // Already visited today, keep streak
        newStreak = parsed.currentStreak
      } else if (lastVisitDate === yesterday) {
        // Visited yesterday, increment streak
        newStreak = parsed.currentStreak + 1
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, start fresh
        newStreak = 1
      }
      
      const updatedData: StreakData = {
        ...parsed,
        currentStreak: newStreak,
        longestStreak: Math.max(parsed.longestStreak, newStreak),
        lastVisit: new Date().toISOString()
      }
      
      setStreakData(updatedData)
      localStorage.setItem('learnhub_streak', JSON.stringify(updatedData))
    } else {
      // First visit
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: new Date().toISOString(),
        totalLessonsCompleted: 0
      }
      setStreakData(newData)
      localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return "Legendary learner! 🏆"
    if (streak >= 14) return "On fire! Keep going! 🔥"
    if (streak >= 7) return "One week strong! 💪"
    if (streak >= 3) return "Building momentum! 🚀"
    return "Great start! 🌟"
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-4">
          <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
            <span className="text-5xl">
              {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '✨' : '🌱'}
            </span>
            {streakData.currentStreak >= 5 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{streakData.currentStreak}</span>
              <span className="text-navy-400 text-lg">day streak</span>
            </div>
            <p className="text-primary-400 font-medium mt-1">
              {getStreakMessage(streakData.currentStreak)}
            </p>
            {streakData.longestStreak > streakData.currentStreak && (
              <p className="text-navy-500 text-sm mt-1">
                Best: {streakData.longestStreak} days
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{streakData.totalLessonsCompleted}</div>
            <div className="text-navy-400 text-xs">Lessons</div>
          </div>
          <div className="w-px h-8 bg-navy-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
            <div className="text-navy-400 text-xs">Best Streak</div>
          </div>
        </div>
      </div>

      {/* Daily Quote */}
      <div className="mt-6 pt-6 border-t border-navy-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💭</span>
          <div>
            <p className="text-navy-300 italic">"{dailyQuote.quote}"</p>
            <p className="text-navy-500 text-sm mt-1">— {dailyQuote.author}</p>
          </div>
        </div>
      </div>
    </div>
  )
}