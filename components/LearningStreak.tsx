'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDaysLearned: number
  lastVisit: string | null
  weekProgress: boolean[]
}

const motivationalMessages = [
  { streak: 1, message: "Great start! 🌱 Every journey begins with a single step." },
  { streak: 3, message: "You're building momentum! 🔥 Keep it going!" },
  { streak: 7, message: "One full week! 🎉 You're officially unstoppable!" },
  { streak: 14, message: "Two weeks strong! 💪 You're in the learning zone!" },
  { streak: 30, message: "30 days! 🏆 You're a learning champion!" },
  { streak: 50, message: "50 days! 🚀 Your dedication is inspiring!" },
  { streak: 100, message: "100 DAYS! 🌟 You're a legend!" },
]

function getMotivationalMessage(streak: number): string {
  const applicable = motivationalMessages.filter(m => streak >= m.streak)
  return applicable.length > 0 
    ? applicable[applicable.length - 1].message 
    : "Start your learning streak today! ✨"
}

function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🌟'
  if (streak >= 50) return '🚀'
  if (streak >= 30) return '🏆'
  if (streak >= 14) return '💪'
  if (streak >= 7) return '🎉'
  if (streak >= 3) return '🔥'
  if (streak >= 1) return '🌱'
  return '✨'
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function isYesterday(date1: Date, date2: Date): boolean {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)
  return date1.toDateString() === yesterday.toDateString()
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDaysLearned: 0,
    lastVisit: null,
    weekProgress: [false, false, false, false, false, false, false]
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date()
    
    if (savedData) {
      const parsed: StreakData = JSON.parse(savedData)
      const lastVisit = parsed.lastVisit ? new Date(parsed.lastVisit) : null
      
      let newStreak = parsed.currentStreak
      let newTotal = parsed.totalDaysLearned
      let streakIncremented = false
      
      if (lastVisit) {
        if (isSameDay(lastVisit, today)) {
          // Same day, no changes needed
          newStreak = parsed.currentStreak
        } else if (isYesterday(lastVisit, today)) {
          // Consecutive day! Increment streak
          newStreak = parsed.currentStreak + 1
          newTotal = parsed.totalDaysLearned + 1
          streakIncremented = true
        } else {
          // Streak broken, start fresh
          newStreak = 1
          newTotal = parsed.totalDaysLearned + 1
          streakIncremented = true
        }
      } else {
        newStreak = 1
        newTotal = 1
        streakIncremented = true
      }
      
      // Calculate week progress (last 7 days including today)
      const weekProgress = calculateWeekProgress(today, parsed.lastVisit ? new Date(parsed.lastVisit) : null, lastVisit && isSameDay(lastVisit, today))
      
      const newLongest = Math.max(parsed.longestStreak, newStreak)
      
      const newData: StreakData = {
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalDaysLearned: newTotal,
        lastVisit: today.toISOString(),
        weekProgress
      }
      
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      
      // Show celebration for streak milestones
      if (streakIncremented && [7, 14, 30, 50, 100].includes(newStreak)) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
      
      setIsNewStreak(streakIncremented)
    } else {
      // First time visitor
      const weekProgress = [false, false, false, false, false, false, true]
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        totalDaysLearned: 1,
        lastVisit: today.toISOString(),
        weekProgress
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setIsNewStreak(true)
    }
  }, [])

  function calculateWeekProgress(today: Date, lastVisit: Date | null, alreadyVisitedToday: boolean): boolean[] {
    const progress: boolean[] = []
    
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today)
      day.setDate(day.getDate() - i)
      
      if (i === 0) {
        // Today
        progress.push(true) // They're here today!
      } else if (lastVisit && i <= streakData.currentStreak) {
        // Rough approximation - in a real app, you'd track each day
        progress.push(true)
      } else {
        progress.push(false)
      }
    }
    
    return progress
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayIndex = new Date().getDay()
  // Reorder to show current week ending with today
  const reorderedLabels = [...dayLabels.slice(todayIndex), ...dayLabels.slice(0, todayIndex)]

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: '1s'
                }}
              >
                {['🎉', '⭐', '🔥', '✨', '🎊'][Math.floor(Math.random() * 5)]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Learning Streak {getStreakEmoji(streakData.currentStreak)}
            </h3>
            <p className="text-navy-400 text-sm mt-1">
              {getMotivationalMessage(streakData.currentStreak)}
            </p>
          </div>
          
          {/* Streak Fire Animation */}
          <div className={`relative ${streakData.currentStreak >= 3 ? 'animate-pulse' : ''}`}>
            <div className="text-4xl font-bold text-primary-400 flex items-center gap-1">
              <span className="text-3xl">🔥</span>
              <span>{streakData.currentStreak}</span>
            </div>
            <div className="text-xs text-navy-400 text-center">day{streakData.currentStreak !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Week Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-1">
            {streakData.weekProgress.map((completed, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full h-3 rounded-full transition-all duration-500 ${
                    completed 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-400 shadow-lg shadow-primary-500/30' 
                      : 'bg-navy-700'
                  } ${index === 6 && isNewStreak ? 'animate-pulse ring-2 ring-primary-400/50' : ''}`}
                />
                <span className="text-xs text-navy-500 mt-1">{reorderedLabels[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-700">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-400">Current</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-400">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{streakData.totalDaysLearned}</div>
            <div className="text-xs text-navy-400">Total Days</div>
          </div>
        </div>

        {/* Encouragement Message */}
        {streakData.currentStreak > 0 && streakData.currentStreak < 7 && (
          <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <p className="text-sm text-primary-300 text-center">
              🎯 {7 - streakData.currentStreak} more day{7 - streakData.currentStreak !== 1 ? 's' : ''} until your first week streak!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}