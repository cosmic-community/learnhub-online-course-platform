'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalLessonsViewed: number
  weeklyActivity: boolean[]
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: '',
  totalLessonsViewed: 0,
  weeklyActivity: [false, false, false, false, false, false, false],
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedData) {
      const parsed: StreakData = JSON.parse(savedData)
      const lastVisit = new Date(parsed.lastVisitDate)
      const todayDate = new Date(today)
      const daysDiff = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 0) {
        // Same day visit
        setStreakData(parsed)
      } else if (daysDiff === 1) {
        // Consecutive day - increase streak!
        const newStreak = parsed.currentStreak + 1
        const newData: StreakData = {
          ...parsed,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, parsed.longestStreak),
          lastVisitDate: today,
          weeklyActivity: updateWeeklyActivity(parsed.weeklyActivity),
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        
        // Show celebration for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 3 || newStreak === 5) {
          setShowAnimation(true)
          setTimeout(() => setShowAnimation(false), 3000)
        }
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          ...parsed,
          currentStreak: 1,
          lastVisitDate: today,
          weeklyActivity: updateWeeklyActivity([false, false, false, false, false, false, false]),
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      }
    } else {
      // First visit
      const newData: StreakData = {
        ...DEFAULT_STREAK_DATA,
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        weeklyActivity: updateWeeklyActivity([false, false, false, false, false, false, false]),
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
    }
    
    setIsLoaded(true)
  }, [])

  function updateWeeklyActivity(current: boolean[]): boolean[] {
    const today = new Date().getDay()
    const newActivity = [...current]
    newActivity[today] = true
    return newActivity
  }

  if (!isLoaded) return null

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const today = new Date().getDay()

  return (
    <>
      {/* Confetti Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl animate-pulse">🔥</div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak!
              </h3>
              <p className="text-navy-400 text-sm">Keep learning daily</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-navy-400">Best Streak</div>
            <div className="text-2xl font-bold text-amber-400">{streakData.longestStreak}</div>
          </div>
        </div>

        {/* Weekly Activity Grid */}
        <div className="flex justify-between gap-1 mt-4">
          {dayLabels.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs text-navy-500">{day}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  streakData.weeklyActivity[index]
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : index === today
                    ? 'bg-navy-700 border-2 border-dashed border-amber-500/50'
                    : 'bg-navy-800'
                }`}
              >
                {streakData.weeklyActivity[index] && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        <div className="mt-4 pt-4 border-t border-navy-700">
          <p className="text-sm text-navy-300">
            {streakData.currentStreak >= 7
              ? "🏆 Amazing dedication! You're on fire!"
              : streakData.currentStreak >= 3
              ? "💪 Great progress! Keep the momentum going!"
              : "🌟 Every day counts. Start your streak today!"}
          </p>
        </div>
      </div>
    </>
  )
}