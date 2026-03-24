'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDaysLearned: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
  requirement: number
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-day', title: 'First Steps', description: 'Start your learning journey', icon: '🌱', unlockedAt: null, requirement: 1 },
  { id: 'week-warrior', title: 'Week Warrior', description: '7 day streak', icon: '⚔️', unlockedAt: null, requirement: 7 },
  { id: 'fortnight-fighter', title: 'Fortnight Fighter', description: '14 day streak', icon: '🛡️', unlockedAt: null, requirement: 14 },
  { id: 'month-master', title: 'Month Master', description: '30 day streak', icon: '👑', unlockedAt: null, requirement: 30 },
  { id: 'century-scholar', title: 'Century Scholar', description: '100 day streak', icon: '🎓', unlockedAt: null, requirement: 100 },
]

const STORAGE_KEY = 'learnhub-streak-data'

function getInitialData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDaysLearned: 0,
    achievements: DEFAULT_ACHIEVEMENTS,
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    let data: StreakData = stored ? JSON.parse(stored) : getInitialData()
    
    const today = new Date()
    const lastVisit = data.lastVisit ? new Date(data.lastVisit) : null

    // Check if this is a new day
    if (!lastVisit || !isSameDay(lastVisit, today)) {
      if (lastVisit && isYesterday(lastVisit, today)) {
        // Continue streak
        data.currentStreak += 1
      } else if (!lastVisit || !isSameDay(lastVisit, today)) {
        // Reset streak if more than 1 day gap (but give credit for first visit)
        if (lastVisit && !isYesterday(lastVisit, today)) {
          data.currentStreak = 1
        } else if (!lastVisit) {
          data.currentStreak = 1
        }
      }
      
      data.totalDaysLearned += 1
      data.lastVisit = today.toISOString()
      
      // Update longest streak
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      // Check for new achievements
      const updatedAchievements = data.achievements.map((achievement) => {
        if (!achievement.unlockedAt && data.currentStreak >= achievement.requirement) {
          const unlocked = { ...achievement, unlockedAt: today.toISOString() }
          // Trigger celebration for new achievement
          setTimeout(() => {
            setNewAchievement(unlocked)
            setShowConfetti(true)
            setTimeout(() => {
              setShowConfetti(false)
              setNewAchievement(null)
            }, 4000)
          }, 500)
          return unlocked
        }
        return achievement
      })
      
      data.achievements = updatedAchievements

      // Save updated data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    setStreakData(data)
  }, [])

  if (!streakData) {
    return null
  }

  const unlockedCount = streakData.achievements.filter(a => a.unlockedAt).length
  const totalAchievements = streakData.achievements.length

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
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '🌟', '🎊', '💫', '⭐'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Popup */}
      {newAchievement && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-achievement-popup">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4 animate-bounce">{newAchievement.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-xl font-semibold text-primary-100">{newAchievement.title}</p>
            <p className="text-primary-200 mt-1">{newAchievement.description}</p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group"
        >
          {/* Glow effect for active streak */}
          {streakData.currentStreak > 0 && (
            <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
          )}
          
          <div className="relative bg-navy-900 border border-navy-700 rounded-full p-3 shadow-lg hover:border-primary-500 transition-all duration-300 flex items-center gap-2">
            <div className={`text-2xl ${streakData.currentStreak > 0 ? 'animate-fire' : ''}`}>
              🔥
            </div>
            <span className="text-white font-bold text-lg pr-1">
              {streakData.currentStreak}
            </span>
          </div>
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Learning Streak</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-navy-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-navy-800 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                  <span className={streakData.currentStreak > 0 ? 'animate-fire' : ''}>🔥</span>
                  {streakData.currentStreak}
                </div>
                <div className="text-xs text-navy-400 mt-1">Current</div>
              </div>
              <div className="bg-navy-800 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">
                  {streakData.longestStreak}
                </div>
                <div className="text-xs text-navy-400 mt-1">Best</div>
              </div>
              <div className="bg-navy-800 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {streakData.totalDaysLearned}
                </div>
                <div className="text-xs text-navy-400 mt-1">Total Days</div>
              </div>
            </div>

            {/* Progress to next achievement */}
            {(() => {
              const nextAchievement = streakData.achievements.find(a => !a.unlockedAt)
              if (!nextAchievement) return null
              const progress = Math.min((streakData.currentStreak / nextAchievement.requirement) * 100, 100)
              return (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-navy-300">Next: {nextAchievement.title}</span>
                    <span className="text-navy-400">{streakData.currentStreak}/{nextAchievement.requirement}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })()}

            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-navy-300">Achievements</h4>
                <span className="text-xs text-navy-500">{unlockedCount}/{totalAchievements}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {streakData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative group cursor-pointer ${
                      achievement.unlockedAt 
                        ? 'opacity-100' 
                        : 'opacity-40 grayscale'
                    }`}
                    title={`${achievement.title}: ${achievement.description}`}
                  >
                    <div className={`text-2xl p-2 bg-navy-800 rounded-lg ${
                      achievement.unlockedAt ? 'ring-2 ring-primary-500/50' : ''
                    }`}>
                      {achievement.icon}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <p className="text-sm font-semibold text-white">{achievement.title}</p>
                      <p className="text-xs text-navy-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational message */}
            <div className="mt-4 pt-4 border-t border-navy-800">
              <p className="text-sm text-center text-navy-400 italic">
                {streakData.currentStreak === 0 
                  ? "Start your streak today! 💪"
                  : streakData.currentStreak < 7 
                  ? "Keep it up! You're building momentum! 🚀"
                  : streakData.currentStreak < 30
                  ? "Amazing consistency! You're on fire! 🔥"
                  : "Incredible dedication! You're a learning machine! 🏆"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}