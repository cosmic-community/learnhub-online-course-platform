'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Steps', icon: '🌱', description: 'Started your learning journey', requirement: 1 },
  { id: 'streak_3', name: 'Getting Warmed Up', icon: '🔥', description: '3 day streak!', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7 day streak!', requirement: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '💪', description: '14 day streak!', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day streak!', requirement: 30 },
  { id: 'visits_10', name: 'Regular', icon: '📚', description: '10 total visits', requirement: 10 },
  { id: 'visits_50', name: 'Committed', icon: '🎯', description: '50 total visits', requirement: 50 },
  { id: 'visits_100', name: 'Centurion', icon: '👑', description: '100 total visits', requirement: 100 },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        data.totalVisits += 1
        
        if (lastVisitDate === yesterdayString) {
          // Consecutive day - increase streak
          data.currentStreak += 1
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
        } else if (lastVisitDate !== today) {
          // Streak broken
          data.currentStreak = 1
        }
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }
        
        data.lastVisit = today
        setShowWelcome(true)
        setTimeout(() => setShowWelcome(false), 4000)
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        achievements: []
      }
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 4000)
    }
    
    // Check for new achievements
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (data.achievements.includes(achievement.id)) return
      
      let earned = false
      if (achievement.id === 'first_visit' && data.totalVisits >= 1) earned = true
      if (achievement.id.startsWith('streak_') && data.currentStreak >= achievement.requirement) earned = true
      if (achievement.id.startsWith('visits_') && data.totalVisits >= achievement.requirement) earned = true
      
      if (earned) {
        newAchievements.push(achievement.id)
        if (!data.achievements.includes(achievement.id)) {
          setNewAchievement(achievement)
          setTimeout(() => setNewAchievement(null), 4000)
        }
      }
    })
    
    data.achievements = [...new Set([...data.achievements, ...newAchievements])]
    
    localStorage.setItem('learnhub_streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextStreakAchievement = ACHIEVEMENTS.find(
    a => a.id.startsWith('streak_') && !streakData.achievements.includes(a.id)
  )

  return (
    <>
      {/* Welcome Back Toast */}
      {showWelcome && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary-500/30 flex items-center gap-3">
            <span className="text-2xl animate-bounce">👋</span>
            <div>
              <p className="font-semibold">Welcome back!</p>
              <p className="text-sm text-primary-100">
                {streakData.currentStreak > 1 
                  ? `You're on a ${streakData.currentStreak} day streak! 🔥`
                  : "Great to see you! Start building your streak!"
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Achievement Toast */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-achievement-pop">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg shadow-orange-500/30">
            <div className="flex items-center gap-4">
              <span className="text-4xl animate-spin-slow">{newAchievement.icon}</span>
              <div>
                <p className="text-sm text-yellow-100">Achievement Unlocked!</p>
                <p className="font-bold text-lg">{newAchievement.name}</p>
                <p className="text-sm text-yellow-100">{newAchievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Streak Widget */}
      <div className="fixed bottom-24 left-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group relative bg-navy-900/90 backdrop-blur-lg border border-navy-700 
            rounded-2xl shadow-xl transition-all duration-300 overflow-hidden
            hover:border-primary-500/50 hover:shadow-primary-500/10
            ${isExpanded ? 'w-72' : 'w-auto'}
          `}
        >
          {/* Collapsed View */}
          <div className={`flex items-center gap-3 p-3 ${isExpanded ? 'border-b border-navy-700' : ''}`}>
            <div className={`
              relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 
              flex items-center justify-center text-2xl
              ${isAnimating ? 'animate-pulse-glow' : ''}
            `}>
              🔥
              {streakData.currentStreak > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-navy-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {streakData.currentStreak}
                </span>
              )}
            </div>
            
            {!isExpanded && (
              <div className="pr-2">
                <p className="text-white font-semibold text-sm">
                  {streakData.currentStreak} day{streakData.currentStreak !== 1 ? 's' : ''}
                </p>
                <p className="text-navy-400 text-xs">streak</p>
              </div>
            )}
            
            {isExpanded && (
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">Learning Streak</p>
                <p className="text-navy-400 text-sm">{streakData.currentStreak} day streak 🔥</p>
              </div>
            )}
            
            <svg 
              className={`w-5 h-5 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="p-4 text-left">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-white">{streakData.currentStreak}</p>
                  <p className="text-xs text-navy-400">Current Streak</p>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-primary-400">{streakData.longestStreak}</p>
                  <p className="text-xs text-navy-400">Best Streak</p>
                </div>
              </div>

              {/* Progress to next achievement */}
              {nextStreakAchievement && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
                    <span>Next: {nextStreakAchievement.name}</span>
                    <span>{streakData.currentStreak}/{nextStreakAchievement.requirement} days</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (streakData.currentStreak / nextStreakAchievement.requirement) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div>
                <p className="text-xs text-navy-400 mb-2">Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.length})</p>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map(achievement => {
                    const earned = streakData.achievements.includes(achievement.id)
                    return (
                      <div
                        key={achievement.id}
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-xl
                          transition-all duration-200
                          ${earned 
                            ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                            : 'bg-navy-800/50 grayscale opacity-40'
                          }
                        `}
                        title={`${achievement.name}: ${achievement.description}`}
                      >
                        {achievement.icon}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Total visits */}
              <div className="mt-4 pt-3 border-t border-navy-700">
                <p className="text-xs text-navy-400">
                  Total visits: <span className="text-white font-medium">{streakData.totalVisits}</span>
                </p>
              </div>
            </div>
          )}
        </button>
      </div>
    </>
  )
}