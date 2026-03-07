'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalDaysLearned: number
  weekProgress: boolean[]
}

const MOTIVATIONAL_MESSAGES = [
  "You're on fire! 🔥",
  "Keep it going! 💪",
  "Amazing progress! ⭐",
  "Unstoppable! 🚀",
  "Learning machine! 🤖",
  "You got this! 🎯",
  "Incredible! 🌟",
  "Champion! 🏆"
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3: "3-day streak! You're building momentum! 🌱",
  7: "One week streak! You're committed! 🔥",
  14: "Two weeks! You're unstoppable! 💪",
  30: "30-day streak! You're a legend! 🏆",
  50: "50 days! Mind-blowing dedication! 🚀",
  100: "100-DAY STREAK! ABSOLUTE LEGEND! 👑"
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const getRandomMessage = useCallback(() => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const storedData = localStorage.getItem('learning-streak')
    
    if (storedData) {
      const data: StreakData = JSON.parse(storedData)
      const lastVisit = new Date(data.lastVisitDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, just load data
        setStreakData(data)
      } else if (diffDays === 1) {
        // Consecutive day - increment streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, data.longestStreak),
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          weekProgress: [...data.weekProgress.slice(1), true]
        }
        setStreakData(newData)
        localStorage.setItem('learning-streak', JSON.stringify(newData))
        
        // Check for milestones
        if (MILESTONE_MESSAGES[newStreak]) {
          setMilestoneMessage(MILESTONE_MESSAGES[newStreak])
          setShowConfetti(true)
          setIsExpanded(true)
          setTimeout(() => {
            setShowConfetti(false)
            setMilestoneMessage(null)
          }, 5000)
        } else {
          // Regular day animation
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
        }
      } else {
        // Streak broken - reset
        const newData: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisitDate: today,
          totalDaysLearned: data.totalDaysLearned + 1,
          weekProgress: [...Array(6).fill(false), true]
        }
        setStreakData(newData)
        localStorage.setItem('learning-streak', JSON.stringify(newData))
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalDaysLearned: 1,
        weekProgress: [...Array(6).fill(false), true]
      }
      setStreakData(newData)
      localStorage.setItem('learning-streak', JSON.stringify(newData))
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  if (!streakData) return null

  const streakLevel = 
    streakData.currentStreak >= 100 ? 'legendary' :
    streakData.currentStreak >= 30 ? 'epic' :
    streakData.currentStreak >= 7 ? 'great' :
    streakData.currentStreak >= 3 ? 'good' : 'starter'

  const levelColors: Record<string, string> = {
    starter: 'from-blue-500 to-blue-600',
    good: 'from-green-500 to-emerald-600',
    great: 'from-yellow-500 to-orange-500',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-yellow-400 via-red-500 to-purple-600'
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {Array.from({ length: 50 }).map((_, i) => (
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
              <div 
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`fixed bottom-24 right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-72' : 'w-auto'
        }`}
      >
        {/* Collapsed View - Floating Button */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className={`group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r ${levelColors[streakLevel]} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
              isAnimating ? 'animate-bounce' : ''
            }`}
          >
            <span className="text-xl">🔥</span>
            <span className="text-lg">{streakData.currentStreak}</span>
            <span className="text-sm opacity-80">day streak</span>
            
            {/* Pulse effect for active streak */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100" />
          </button>
        )}

        {/* Expanded View - Full Card */}
        {isExpanded && (
          <div className="bg-navy-900/95 backdrop-blur-lg border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className={`px-5 py-4 bg-gradient-to-r ${levelColors[streakLevel]}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-pulse">🔥</span>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {streakData.currentStreak} Day Streak
                    </div>
                    <div className="text-sm text-white/80">
                      {getRandomMessage()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Milestone Message */}
            {milestoneMessage && (
              <div className="px-5 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30">
                <p className="text-yellow-300 text-center font-medium animate-pulse">
                  {milestoneMessage}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="p-5 space-y-4">
              {/* Week Progress */}
              <div>
                <div className="text-sm text-navy-400 mb-2">This Week</div>
                <div className="flex justify-between gap-1">
                  {streakData.weekProgress.map((active, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                          active 
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'bg-navy-800 text-navy-500'
                        }`}
                      >
                        {active ? '✓' : dayLabels[i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-xs text-navy-400">Best Streak</div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {streakData.totalDaysLearned}
                  </div>
                  <div className="text-xs text-navy-400">Total Days</div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div>
                <div className="text-sm text-navy-400 mb-2">Achievements</div>
                <div className="flex gap-2 flex-wrap">
                  {streakData.totalDaysLearned >= 1 && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      🌟 First Step
                    </span>
                  )}
                  {streakData.currentStreak >= 3 && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      🌱 Growing
                    </span>
                  )}
                  {streakData.currentStreak >= 7 && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                      🔥 On Fire
                    </span>
                  )}
                  {streakData.longestStreak >= 14 && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                      💪 Dedicated
                    </span>
                  )}
                  {streakData.longestStreak >= 30 && (
                    <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-medium">
                      🏆 Champion
                    </span>
                  )}
                </div>
              </div>

              {/* Encouragement */}
              <div className="text-center pt-2 border-t border-navy-800">
                <p className="text-sm text-navy-300">
                  {streakData.currentStreak === 1 
                    ? "Start your journey! Come back tomorrow to build your streak! 🚀"
                    : `Come back tomorrow to keep your ${streakData.currentStreak}-day streak! ⚡`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}