'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  todayVisited: boolean
}

const STREAK_STORAGE_KEY = 'learnhub-streak-data'
const MILESTONES = [3, 7, 14, 30, 50, 100, 365]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [justIncremented, setJustIncremented] = useState(false)

  useEffect(() => {
    const loadAndUpdateStreak = () => {
      const stored = localStorage.getItem(STREAK_STORAGE_KEY)
      const today = new Date().toDateString()
      
      let data: StreakData
      
      if (stored) {
        data = JSON.parse(stored) as StreakData
        const lastVisitDate = new Date(data.lastVisit).toDateString()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()
        
        if (lastVisitDate === today) {
          // Already visited today
          data.todayVisited = true
        } else if (lastVisitDate === yesterdayStr) {
          // Continuing streak from yesterday
          data.currentStreak += 1
          data.totalDays += 1
          data.lastVisit = new Date().toISOString()
          data.todayVisited = true
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
          setJustIncremented(true)
          
          // Check for milestone celebration
          if (MILESTONES.includes(data.currentStreak)) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
        } else {
          // Streak broken, start fresh
          data.currentStreak = 1
          data.totalDays += 1
          data.lastVisit = new Date().toISOString()
          data.todayVisited = true
        }
      } else {
        // First time visitor
        data = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisit: new Date().toISOString(),
          totalDays: 1,
          todayVisited: true
        }
        setJustIncremented(true)
      }
      
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
      setStreakData(data)
    }

    // Small delay to avoid hydration issues
    const timer = setTimeout(loadAndUpdateStreak, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 365) return '👑'
    if (streak >= 100) return '💎'
    if (streak >= 50) return '🏆'
    if (streak >= 30) return '🌟'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 365) return 'Legendary learner!'
    if (streak >= 100) return 'Unstoppable!'
    if (streak >= 50) return 'Learning master!'
    if (streak >= 30) return 'On fire!'
    if (streak >= 14) return 'Two weeks strong!'
    if (streak >= 7) return 'One week streak!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || streakData.currentStreak + 1
  const progress = (streakData.currentStreak / nextMilestone) * 100

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="celebration-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-bounce-in text-center">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-white bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                {streakData.currentStreak} Day Streak!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 hover-lift ${
            justIncremented ? 'animate-bounce-in' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15), transparent 70%)',
            }}
          />
          
          {/* Fire emoji with animation */}
          <span 
            className={`text-2xl ${streakData.currentStreak >= 7 ? 'animate-streak-fire' : ''}`}
          >
            {getStreakEmoji(streakData.currentStreak)}
          </span>
          
          {/* Streak count */}
          <div className="relative flex flex-col items-start">
            <span className="text-lg font-bold text-white leading-tight">
              {streakData.currentStreak}
            </span>
            <span className="text-xs text-navy-400 leading-tight">
              day{streakData.currentStreak !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Expand indicator */}
          <svg 
            className={`w-4 h-4 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div 
            className="absolute bottom-full right-0 mb-3 w-72 p-5 rounded-2xl shadow-2xl animate-bounce-in"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Learning Streak</h3>
              <div className="streak-badge text-white text-sm">
                <span className="animate-streak-fire">🔥</span>
                {streakData.currentStreak}
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-navy-300 mb-4">
              {getStreakMessage(streakData.currentStreak)}
            </p>

            {/* Progress to next milestone */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-navy-400 mb-2">
                <span>Next milestone: {nextMilestone} days</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 gradient-animated"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)',
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best</div>
              </div>
              <div className="col-span-2 bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{streakData.totalDays}</div>
                <div className="text-xs text-navy-400">Total Days Learning</div>
              </div>
            </div>

            {/* Motivational tip */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-xs text-navy-400 text-center">
                💡 Come back tomorrow to keep your streak alive!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}