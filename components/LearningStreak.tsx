'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  recentDays: string[] // Last 7 days visited
}

const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 0, message: "Start your learning journey today! 🚀", emoji: "🌱" },
  { min: 1, max: 2, message: "Great start! Keep the momentum going!", emoji: "🌟" },
  { min: 3, max: 6, message: "You're building a habit! Amazing!", emoji: "🔥" },
  { min: 7, max: 13, message: "One week strong! You're unstoppable!", emoji: "💪" },
  { min: 14, max: 29, message: "Two weeks of dedication! Incredible!", emoji: "🏆" },
  { min: 30, max: 59, message: "A month of learning! You're a champion!", emoji: "👑" },
  { min: 60, max: 89, message: "Two months! Your dedication is inspiring!", emoji: "💎" },
  { min: 90, max: Infinity, message: "Legendary learner! You're on fire!", emoji: "🌋" },
]

const MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMilestone, setCelebrationMilestone] = useState(0)
  const [mounted, setMounted] = useState(false)

  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const getYesterdayString = useCallback(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }, [])

  const getLast7Days = useCallback(() => {
    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }, [])

  useEffect(() => {
    setMounted(true)
    
    const stored = localStorage.getItem('learnhub-streak')
    const today = getTodayString()
    const yesterday = getYesterdayString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      
      if (data.lastVisit === today) {
        // Already visited today
        setStreakData(data)
      } else if (data.lastVisit === yesterday) {
        // Continuing streak from yesterday
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        const newRecentDays = [...data.recentDays.filter(d => getLast7Days().includes(d)), today]
        
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          recentDays: newRecentDays.slice(-7),
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Check for milestone celebration
        if (MILESTONES.includes(newStreak)) {
          setCelebrationMilestone(newStreak)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 4000)
        }
      } else {
        // Streak broken - start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
          recentDays: [today],
        }
        
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1,
        recentDays: [today],
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
    }
  }, [getTodayString, getYesterdayString, getLast7Days])

  if (!mounted || !streakData) {
    return null
  }

  const getMessage = () => {
    const found = MOTIVATIONAL_MESSAGES.find(
      m => streakData.currentStreak >= m.min && streakData.currentStreak <= m.max
    )
    return found || MOTIVATIONAL_MESSAGES[0]
  }

  const message = getMessage()
  const last7Days = getLast7Days()

  // Fire intensity based on streak
  const getFireIntensity = () => {
    if (streakData.currentStreak >= 30) return 'text-orange-400 animate-pulse'
    if (streakData.currentStreak >= 14) return 'text-orange-500'
    if (streakData.currentStreak >= 7) return 'text-yellow-500'
    if (streakData.currentStreak >= 3) return 'text-yellow-400'
    return 'text-navy-400'
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce text-center">
            <div className="text-8xl mb-4">🎉</div>
            <div className="bg-gradient-to-r from-primary-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-2xl font-bold">{celebrationMilestone} Day Streak!</p>
              <p className="text-lg opacity-90">You&apos;re incredible! Keep going!</p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-full
            bg-navy-900/95 backdrop-blur-sm border border-navy-700
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:border-primary-500/50 hover:scale-105
            ${isExpanded ? 'rounded-t-2xl rounded-b-none border-b-0' : ''}
          `}
        >
          <span className={`text-2xl ${getFireIntensity()} transition-colors duration-300`}>
            🔥
          </span>
          <span className="text-white font-bold text-lg">
            {streakData.currentStreak}
          </span>
          <span className="text-navy-400 text-sm hidden sm:inline">
            day{streakData.currentStreak !== 1 ? 's' : ''}
          </span>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-0 w-72 sm:w-80 bg-navy-900/95 backdrop-blur-sm border border-navy-700 border-b-0 rounded-t-2xl rounded-br-none shadow-xl animate-fade-in">
            <div className="p-4">
              {/* Header with Emoji */}
              <div className="text-center mb-4">
                <span className="text-4xl">{message.emoji}</span>
                <p className="text-navy-300 text-sm mt-2">{message.message}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-400">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-xs text-navy-400">Current</div>
                </div>
                <div className="text-center p-2 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-navy-400">Longest</div>
                </div>
                <div className="text-center p-2 bg-navy-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {streakData.totalDays}
                  </div>
                  <div className="text-xs text-navy-400">Total</div>
                </div>
              </div>

              {/* Mini Calendar */}
              <div className="mb-3">
                <p className="text-xs text-navy-400 mb-2 text-center">Last 7 Days</p>
                <div className="flex justify-center gap-1.5">
                  {last7Days.map((day, index) => {
                    const isActive = streakData.recentDays.includes(day)
                    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                    const dayOfWeek = new Date(day).getDay()
                    
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-[10px] text-navy-500 mb-1">
                          {dayNames[dayOfWeek]}
                        </span>
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                            transition-all duration-300
                            ${isActive 
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                              : 'bg-navy-800 text-navy-500'
                            }
                            ${index === 6 ? 'ring-2 ring-primary-400/50' : ''}
                          `}
                        >
                          {isActive ? '✓' : '·'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Next Milestone */}
              {(() => {
                const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak)
                if (nextMilestone) {
                  const progress = (streakData.currentStreak / nextMilestone) * 100
                  return (
                    <div className="pt-3 border-t border-navy-800">
                      <div className="flex justify-between text-xs text-navy-400 mb-1.5">
                        <span>Next milestone</span>
                        <span>{nextMilestone} days</span>
                      </div>
                      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-navy-500 text-center mt-1.5">
                        {nextMilestone - streakData.currentStreak} day{nextMilestone - streakData.currentStreak !== 1 ? 's' : ''} to go!
                      </p>
                    </div>
                  )
                }
                return (
                  <div className="pt-3 border-t border-navy-800 text-center">
                    <span className="text-yellow-400 text-lg">👑</span>
                    <p className="text-sm text-navy-300">Legendary Status Achieved!</p>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}