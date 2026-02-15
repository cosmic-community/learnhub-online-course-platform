'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  lastVisitDate: string
  longestStreak: number
  totalVisits: number
}

const STREAK_STORAGE_KEY = 'learnhub_learning_streak'

const getMotivationalMessage = (streak: number): string => {
  if (streak === 0) return "Start your learning journey today!"
  if (streak === 1) return "Great start! Come back tomorrow to build your streak!"
  if (streak === 2) return "Two days strong! You're building a habit!"
  if (streak < 5) return "Keep it up! Consistency is key!"
  if (streak < 7) return "Almost a week! You're unstoppable!"
  if (streak === 7) return "🎉 One week streak! Amazing dedication!"
  if (streak < 14) return "Over a week! You're a learning machine!"
  if (streak < 30) return "Incredible commitment! Keep going!"
  if (streak === 30) return "🏆 30 days! You're a true learner!"
  if (streak < 50) return "Legendary dedication! You inspire us!"
  if (streak < 100) return "Almost triple digits! Phenomenal!"
  return "🌟 100+ days! You're absolutely extraordinary!"
}

const getMilestoneEmoji = (streak: number): string => {
  if (streak >= 100) return '👑'
  if (streak >= 50) return '🏆'
  if (streak >= 30) return '🔥'
  if (streak >= 14) return '⚡'
  if (streak >= 7) return '🌟'
  if (streak >= 3) return '✨'
  return '🔥'
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const storedData = localStorage.getItem(STREAK_STORAGE_KEY)
    
    let data: StreakData = storedData 
      ? JSON.parse(storedData) 
      : { currentStreak: 0, lastVisitDate: '', longestStreak: 0, totalVisits: 0 }
    
    if (data.lastVisitDate === today) {
      // Already visited today, just show current data
      setStreakData(data)
      return
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toDateString()
    
    const previousStreak = data.currentStreak
    
    if (data.lastVisitDate === yesterdayString) {
      // Consecutive day - increment streak
      data.currentStreak += 1
    } else if (data.lastVisitDate === '') {
      // First visit ever
      data.currentStreak = 1
    } else {
      // Streak broken - reset to 1
      data.currentStreak = 1
    }
    
    data.lastVisitDate = today
    data.totalVisits += 1
    
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak
    }
    
    // Check for milestone celebrations
    const milestones = [3, 7, 14, 30, 50, 100]
    const hitMilestone = milestones.includes(data.currentStreak) && data.currentStreak > previousStreak
    
    if (hitMilestone) {
      setShowCelebration(true)
      setIsNewMilestone(true)
      setTimeout(() => setShowCelebration(false), 3000)
      setTimeout(() => setIsNewMilestone(false), 5000)
    }
    
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  if (!streakData) return null

  const { currentStreak, longestStreak, totalVisits } = streakData

  return (
    <>
      {/* Confetti celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#14b8a6', '#fbbf24', '#ef4444', '#8b5cf6', '#3b82f6'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Main streak widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <div 
          className={`
            relative cursor-pointer transition-all duration-300 ease-out
            ${isExpanded ? 'scale-100' : 'scale-100 hover:scale-105'}
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Collapsed view - just the streak badge */}
          <div 
            className={`
              flex items-center gap-2 bg-navy-900/95 backdrop-blur-lg rounded-full px-4 py-2
              border border-navy-700 shadow-lg shadow-primary-500/10
              ${isNewMilestone ? 'animate-pulse ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''}
              transition-all duration-300
            `}
          >
            <span className={`text-xl ${currentStreak > 0 ? 'animate-flame' : ''}`}>
              {getMilestoneEmoji(currentStreak)}
            </span>
            <span className="text-white font-bold">{currentStreak}</span>
            <span className="text-navy-400 text-sm">day{currentStreak !== 1 ? 's' : ''}</span>
            
            <svg 
              className={`w-4 h-4 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>

          {/* Expanded view - full stats */}
          <div 
            className={`
              absolute bottom-full left-0 mb-2 
              bg-navy-900/95 backdrop-blur-lg rounded-xl
              border border-navy-700 shadow-xl shadow-primary-500/10
              overflow-hidden transition-all duration-300 ease-out
              ${isExpanded 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-2 pointer-events-none'}
            `}
            style={{ minWidth: '280px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/10 px-4 py-3 border-b border-navy-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <span className="text-xl">📚</span>
                Learning Streak
              </h3>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Current streak showcase */}
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 mb-2">
                  <span className={`text-4xl ${currentStreak > 0 ? 'animate-flame' : ''}`}>
                    {getMilestoneEmoji(currentStreak)}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {currentStreak} <span className="text-lg text-navy-400 font-normal">days</span>
                </div>
                <p className="text-sm text-primary-400 mt-1">{getMotivationalMessage(currentStreak)}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-400">🏆 {longestStreak}</div>
                  <div className="text-xs text-navy-400">Longest Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-primary-400">📅 {totalVisits}</div>
                  <div className="text-xs text-navy-400">Total Visits</div>
                </div>
              </div>

              {/* Streak milestones progress */}
              <div className="space-y-2">
                <div className="text-xs text-navy-400 font-medium">Next milestone</div>
                <div className="flex items-center gap-2">
                  {[3, 7, 14, 30, 50, 100].map((milestone) => (
                    <div 
                      key={milestone}
                      className={`
                        flex-1 h-2 rounded-full transition-all duration-500
                        ${currentStreak >= milestone 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-400' 
                          : 'bg-navy-700'}
                      `}
                      title={`${milestone} days`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-navy-500">
                  <span>3d</span>
                  <span>7d</span>
                  <span>14d</span>
                  <span>30d</span>
                  <span>50d</span>
                  <span>100d</span>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-primary-500/10 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-300">
                  💡 Visit daily to build your streak and unlock achievements!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}