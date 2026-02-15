'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalVisits: number
  lastVisit: string
}

const STREAK_KEY = 'learnhub_streak'

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Start your learning journey today! 🚀"
  if (streak === 1) return "Great start! Come back tomorrow! 🌟"
  if (streak <= 3) return "You're building momentum! 💪"
  if (streak <= 7) return "One week warrior! Keep it up! 🔥"
  if (streak <= 14) return "Two weeks strong! You're unstoppable! ⚡"
  if (streak <= 30) return "Monthly master! Incredible dedication! 🏆"
  if (streak <= 60) return "Learning legend in the making! 👑"
  if (streak <= 100) return "Century club! You're inspiring! 🌈"
  return "Absolute learning champion! 🎯✨"
}

function getMilestoneEmoji(streak: number): string {
  if (streak >= 100) return "💎"
  if (streak >= 60) return "👑"
  if (streak >= 30) return "🏆"
  if (streak >= 14) return "⚡"
  if (streak >= 7) return "🔥"
  if (streak >= 3) return "💪"
  if (streak >= 1) return "🌟"
  return "🚀"
}

export default function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    // Load or initialize streak data
    const savedData = localStorage.getItem(STREAK_KEY)
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (savedData) {
      data = JSON.parse(savedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, don't update streak
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayStr) {
        // Consecutive day! Increment streak
        const oldStreak = data.currentStreak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        
        // Check for milestone
        const milestones = [3, 7, 14, 30, 60, 100]
        if (milestones.includes(data.currentStreak) && data.currentStreak > oldStreak) {
          setIsNewMilestone(true)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        totalVisits: 1,
        lastVisit: new Date().toISOString()
      }
      setIsNewMilestone(true)
    }
    
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const milestoneEmoji = getMilestoneEmoji(streakData.currentStreak)
  const message = getMotivationalMessage(streakData.currentStreak)

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '⭐', '🎊', '✨', '🌟', '💫', '🔥'][Math.floor(Math.random() * 7)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-red-500
            text-white font-bold shadow-lg shadow-orange-500/30
            hover:shadow-orange-500/50 transition-all duration-300
            ${isExpanded ? 'rounded-b-none rounded-t-2xl' : ''}
            ${streakData.currentStreak >= 7 ? 'animate-pulse-slow' : ''}
          `}
          aria-label="Toggle streak tracker"
        >
          {/* Fire animation for active streaks */}
          <span className={`text-xl ${streakData.currentStreak >= 3 ? 'animate-bounce-slow' : ''}`}>
            🔥
          </span>
          <span className="text-lg">{streakData.currentStreak}</span>
          <span className="text-sm opacity-80">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {/* New milestone badge */}
          {isNewMilestone && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
              NEW!
            </span>
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-0 w-72 bg-navy-900 border border-navy-700 rounded-2xl rounded-bl-none shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Learning Streak</h3>
                  <p className="text-sm opacity-90">{message}</p>
                </div>
                <span className="text-4xl">{milestoneEmoji}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-4">
              {/* Current Streak */}
              <div className="flex items-center justify-between p-3 bg-navy-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-navy-400 text-xs">Current Streak</p>
                    <p className="text-white font-bold text-xl">{streakData.currentStreak} days</p>
                  </div>
                </div>
              </div>

              {/* Other Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                  <span className="text-lg">🏆</span>
                  <p className="text-navy-400 text-xs mt-1">Best Streak</p>
                  <p className="text-white font-semibold">{streakData.longestStreak} days</p>
                </div>
                <div className="p-3 bg-navy-800/30 rounded-lg text-center">
                  <span className="text-lg">📚</span>
                  <p className="text-navy-400 text-xs mt-1">Total Visits</p>
                  <p className="text-white font-semibold">{streakData.totalVisits}</p>
                </div>
              </div>

              {/* Progress to next milestone */}
              {streakData.currentStreak < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-navy-400">Next milestone</span>
                    <span className="text-primary-400">
                      {(() => {
                        const milestones = [3, 7, 14, 30, 60, 100]
                        const next = milestones.find(m => m > streakData.currentStreak)
                        return next ? `${next} days` : 'Achieved!'
                      })()}
                    </span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{
                        width: `${(() => {
                          const milestones = [0, 3, 7, 14, 30, 60, 100]
                          const current = streakData.currentStreak
                          const prevMilestone = [...milestones].reverse().find(m => m < current) ?? 0
                          const nextMilestone = milestones.find(m => m > current) ?? 100
                          return ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
                        })()}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Motivational tip */}
              <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                <p className="text-sm text-primary-300">
                  💡 <span className="font-medium">Pro tip:</span> Learn something new every day to keep your streak alive!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}