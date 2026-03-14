'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDays: number
}

const motivationalMessages = [
  { minStreak: 0, message: "Start your learning journey today! 🚀" },
  { minStreak: 1, message: "Great start! Keep the momentum going! 💪" },
  { minStreak: 3, message: "You're on fire! 3 days strong! 🔥" },
  { minStreak: 7, message: "One week streak! You're unstoppable! ⭐" },
  { minStreak: 14, message: "Two weeks! Learning is becoming a habit! 🎯" },
  { minStreak: 30, message: "30 days! You're a learning champion! 🏆" },
  { minStreak: 60, message: "60 days! Your dedication is inspiring! 💎" },
  { minStreak: 100, message: "100 days! Legendary learner status! 👑" },
]

function getMotivationalMessage(streak: number): string {
  const sorted = [...motivationalMessages].sort((a, b) => b.minStreak - a.minStreak)
  const match = sorted.find(m => streak >= m.minStreak)
  return match?.message || motivationalMessages[0].message
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0] === dateString
}

function isToday(dateString: string): boolean {
  return getTodayString() === dateString
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('learnhub-streak')
    const today = getTodayString()
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      
      if (isToday(data.lastVisitDate)) {
        // Already visited today
        setStreakData(data)
      } else if (isYesterday(data.lastVisitDate)) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(data.longestStreak, newStreak),
          lastVisitDate: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
        
        // Celebrate milestones
        if ([3, 7, 14, 30, 60, 100].includes(newStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalDays: data.totalDays + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newData))
        setStreakData(newData)
      }
    } else {
      // First time visitor
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDays: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      setStreakData(newData)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '24px',
              }}
            >
              {['🎉', '⭐', '🔥', '💪', '🚀', '✨'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
      
      {/* Streak widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group relative flex items-center gap-2 px-4 py-3 
            bg-gradient-to-r from-orange-500 to-amber-500 
            text-white font-semibold rounded-full shadow-lg 
            hover:shadow-orange-500/30 hover:shadow-xl
            transition-all duration-300 transform hover:scale-105
            ${showCelebration ? 'animate-bounce' : ''}
          `}
        >
          <span className="text-2xl animate-pulse-slow">🔥</span>
          <span className="text-lg">{streakData.currentStreak}</span>
          <span className="text-xs opacity-80">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        </button>
        
        {/* Expanded card */}
        <div className={`
          absolute bottom-full right-0 mb-3 w-72
          transform transition-all duration-300 origin-bottom-right
          ${isExpanded ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}>
          <div className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl p-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🔥</span> Learning Streak
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400">Current</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400">Best</div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{streakData.totalDays}</div>
                <div className="text-xs text-navy-400">Total</div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            {streakData.currentStreak < 100 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-navy-400 mb-1">
                  <span>Next milestone</span>
                  <span>
                    {(() => {
                      const milestones = [3, 7, 14, 30, 60, 100]
                      const next = milestones.find(m => m > streakData.currentStreak) || 100
                      return `${next} days`
                    })()}
                  </span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(() => {
                        const milestones = [0, 3, 7, 14, 30, 60, 100]
                        const current = streakData.currentStreak
                        let prev = 0
                        let next = 3
                        for (let i = 0; i < milestones.length - 1; i++) {
                          if (current >= milestones[i] && current < milestones[i + 1]) {
                            prev = milestones[i]
                            next = milestones[i + 1]
                            break
                          }
                        }
                        return ((current - prev) / (next - prev)) * 100
                      })()}%`
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Motivational message */}
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-3">
              <p className="text-sm text-center text-orange-200">
                {getMotivationalMessage(streakData.currentStreak)}
              </p>
            </div>
            
            {/* Week view */}
            <div className="mt-4">
              <div className="text-xs text-navy-400 mb-2">This week</div>
              <div className="flex gap-1 justify-between">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const today = new Date()
                  const dayOfWeek = today.getDay()
                  const isActiveDay = i <= dayOfWeek && streakData.currentStreak >= (dayOfWeek - i + 1)
                  const isCurrentDay = i === dayOfWeek
                  
                  return (
                    <div
                      key={i}
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                        transition-all duration-300
                        ${isActiveDay 
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' 
                          : 'bg-navy-800 text-navy-500'
                        }
                        ${isCurrentDay ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-navy-900' : ''}
                      `}
                    >
                      {isActiveDay ? '🔥' : day}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}