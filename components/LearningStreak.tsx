'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalDays: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'First Step', icon: '🌱', description: 'Started your learning journey', requirement: 1 },
  { id: 'streak_3', name: 'Getting Started', icon: '🔥', description: '3 day streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7 day streak', requirement: 7 },
  { id: 'streak_14', name: 'Dedicated Learner', icon: '💎', description: '14 day streak', requirement: 14 },
  { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day streak', requirement: 30 },
  { id: 'total_10', name: 'Regular Reader', icon: '📚', description: '10 total visits', requirement: 10 },
  { id: 'total_50', name: 'Knowledge Seeker', icon: '🎯', description: '50 total visits', requirement: 50 },
  { id: 'total_100', name: 'Learning Legend', icon: '👑', description: '100 total visits', requirement: 100 },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showFireAnimation, setShowFireAnimation] = useState(false)

  useEffect(() => {
    const data = initializeStreak()
    setStreakData(data.streakData)
    
    if (data.isNewDay) {
      setShowFireAnimation(true)
      setTimeout(() => setShowFireAnimation(false), 2000)
    }
    
    if (data.newAchievement) {
      setTimeout(() => {
        setNewAchievement(data.newAchievement)
        setTimeout(() => setNewAchievement(null), 4000)
      }, 1000)
    }
  }, [])

  function initializeStreak(): { 
    streakData: StreakData
    isNewDay: boolean
    newAchievement: typeof ACHIEVEMENTS[0] | null 
  } {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    let isNewDay = false
    let newAchievement: typeof ACHIEVEMENTS[0] | null = null
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalDays: 0,
      achievements: []
    }

    if (data.lastVisit !== today) {
      isNewDay = true
      const lastDate = data.lastVisit ? new Date(data.lastVisit) : null
      const todayDate = new Date(today)
      
      if (lastDate) {
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          data.currentStreak += 1
        } else if (diffDays > 1) {
          data.currentStreak = 1
        }
      } else {
        data.currentStreak = 1
      }
      
      data.totalDays += 1
      data.lastVisit = today
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }

      // Check for new achievements
      const earnedAchievements = [...data.achievements]
      
      for (const achievement of ACHIEVEMENTS) {
        if (earnedAchievements.includes(achievement.id)) continue
        
        let earned = false
        if (achievement.id === 'first_visit' && data.totalDays >= 1) earned = true
        if (achievement.id === 'streak_3' && data.currentStreak >= 3) earned = true
        if (achievement.id === 'streak_7' && data.currentStreak >= 7) earned = true
        if (achievement.id === 'streak_14' && data.currentStreak >= 14) earned = true
        if (achievement.id === 'streak_30' && data.currentStreak >= 30) earned = true
        if (achievement.id === 'total_10' && data.totalDays >= 10) earned = true
        if (achievement.id === 'total_50' && data.totalDays >= 50) earned = true
        if (achievement.id === 'total_100' && data.totalDays >= 100) earned = true
        
        if (earned) {
          earnedAchievements.push(achievement.id)
          if (!newAchievement) {
            newAchievement = achievement
          }
        }
      }
      
      data.achievements = earnedAchievements
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }

    return { streakData: data, isNewDay, newAchievement }
  }

  if (!streakData) return null

  const unlockedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter(a => !streakData.achievements.includes(a.id))

  return (
    <>
      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <span className="text-4xl">{newAchievement.icon}</span>
            <div>
              <p className="text-sm font-medium opacity-90">Achievement Unlocked!</p>
              <p className="text-lg font-bold">{newAchievement.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative flex items-center gap-2 bg-navy-900/95 backdrop-blur-sm border border-navy-700 
            rounded-full px-4 py-2 text-white font-medium shadow-lg hover:border-primary-500/50 
            transition-all duration-300 group
            ${showFireAnimation ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-950' : ''}
          `}
        >
          <span className={`text-2xl ${showFireAnimation ? 'animate-pulse' : ''}`}>
            {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'}
          </span>
          <span className="text-lg font-bold">{streakData.currentStreak}</span>
          <span className="text-sm text-navy-400">day{streakData.currentStreak !== 1 ? 's' : ''}</span>
          
          {showFireAnimation && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute bottom-14 left-0 w-80 bg-navy-900/95 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500/20 to-navy-800 p-4 border-b border-navy-700">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎓</span> Learning Streak
              </h3>
              <p className="text-sm text-navy-300 mt-1">Keep learning to maintain your streak!</p>
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-primary-400">{streakData.currentStreak}</div>
                <div className="text-xs text-navy-400 mt-1">Current</div>
              </div>
              <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                <div className="text-xs text-navy-400 mt-1">Best</div>
              </div>
              <div className="text-center p-3 bg-navy-800/50 rounded-xl">
                <div className="text-2xl font-bold text-green-400">{streakData.totalDays}</div>
                <div className="text-xs text-navy-400 mt-1">Total</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-4 border-t border-navy-700">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span>🏅</span> Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
              </h4>
              
              <div className="grid grid-cols-4 gap-2">
                {unlockedAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="relative group"
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-navy-700 rounded-xl flex items-center justify-center text-2xl border border-primary-500/30 hover:scale-110 transition-transform cursor-pointer">
                      {achievement.icon}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-xs text-white rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {achievement.name}
                    </div>
                  </div>
                ))}
                
                {lockedAchievements.slice(0, 4 - (unlockedAchievements.length % 4 || 4)).map(achievement => (
                  <div
                    key={achievement.id}
                    className="relative group"
                    title={`Locked: ${achievement.description}`}
                  >
                    <div className="w-12 h-12 bg-navy-800/50 rounded-xl flex items-center justify-center text-2xl opacity-30 border border-navy-700 cursor-pointer">
                      {achievement.icon}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-xs text-navy-400 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      🔒 {achievement.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Message */}
            <div className="p-4 bg-navy-800/30 border-t border-navy-700">
              <p className="text-sm text-navy-300 text-center">
                {streakData.currentStreak === 0 
                  ? "Start your streak today! 🚀"
                  : streakData.currentStreak >= 7 
                    ? "You're on fire! Keep it up! 🔥"
                    : streakData.currentStreak >= 3
                      ? "Great momentum! Don't break the chain! ⚡"
                      : "Nice start! Come back tomorrow! ✨"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}