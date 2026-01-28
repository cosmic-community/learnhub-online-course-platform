'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'streak-3', title: 'On Fire', description: '3 day learning streak', icon: '🔥' },
  { id: 'streak-7', title: 'Week Warrior', description: '7 day learning streak', icon: '⚡' },
  { id: 'streak-30', title: 'Monthly Master', description: '30 day learning streak', icon: '👑' },
  { id: 'lessons-10', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '📚' },
  { id: 'lessons-50', title: 'Scholar', description: 'Complete 50 lessons', icon: '🎓' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalLessonsCompleted: 0,
    achievements: [],
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load streak data from localStorage
    const saved = localStorage.getItem('learnhub-streak')
    if (saved) {
      const data = JSON.parse(saved) as StreakData
      setStreakData(data)
      
      // Check if we need to update the streak
      const today = new Date().toDateString()
      const lastActive = new Date(data.lastActiveDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastActive !== today && lastActive !== yesterday) {
        // Streak broken - reset but keep longest
        setStreakData(prev => ({
          ...prev,
          currentStreak: 0,
        }))
      }
    } else {
      // Initialize with demo data for first-time visitors
      const demoData: StreakData = {
        currentStreak: 3,
        longestStreak: 7,
        lastActiveDate: new Date().toISOString(),
        totalLessonsCompleted: 12,
        achievements: [
          { ...ACHIEVEMENTS[0]!, unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
          { ...ACHIEVEMENTS[1]!, unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
        ],
      }
      setStreakData(demoData)
      localStorage.setItem('learnhub-streak', JSON.stringify(demoData))
    }
  }, [])

  const recordActivity = () => {
    const today = new Date().toDateString()
    const lastActive = new Date(streakData.lastActiveDate).toDateString()
    
    if (lastActive === today) return // Already recorded today
    
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const isConsecutive = lastActive === yesterday
    
    const newStreak = isConsecutive ? streakData.currentStreak + 1 : 1
    const newLongest = Math.max(newStreak, streakData.longestStreak)
    
    const updated: StreakData = {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: new Date().toISOString(),
      totalLessonsCompleted: streakData.totalLessonsCompleted + 1,
    }
    
    // Check for new achievements
    const newAchievements = [...updated.achievements]
    if (newStreak >= 3 && !newAchievements.find(a => a.id === 'streak-3')) {
      newAchievements.push({ ...ACHIEVEMENTS[1]!, unlockedAt: new Date().toISOString() })
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    if (newStreak >= 7 && !newAchievements.find(a => a.id === 'streak-7')) {
      newAchievements.push({ ...ACHIEVEMENTS[2]!, unlockedAt: new Date().toISOString() })
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    
    updated.achievements = newAchievements
    setStreakData(updated)
    localStorage.setItem('learnhub-streak', JSON.stringify(updated))
  }

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-24 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Celebration confetti effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
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
              {['🎉', '⭐', '🔥', '✨', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          Your Learning Streak
        </h3>
        <button
          onClick={recordActivity}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          Record Today
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-3xl font-bold text-primary-400 mb-1">
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-navy-400">Current Streak</div>
          <div className="text-lg mt-1">
            {streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '💪'}
          </div>
        </div>
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {streakData.longestStreak}
          </div>
          <div className="text-xs text-navy-400">Best Streak</div>
          <div className="text-lg mt-1">🏆</div>
        </div>
        <div className="text-center p-4 bg-navy-800/50 rounded-xl">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {streakData.totalLessonsCompleted}
          </div>
          <div className="text-xs text-navy-400">Lessons Done</div>
          <div className="text-lg mt-1">📖</div>
        </div>
      </div>

      {/* Week view */}
      <div className="mb-6">
        <div className="text-sm text-navy-400 mb-3">This Week</div>
        <div className="flex justify-between gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
            const today = new Date().getDay()
            const isToday = i === today
            const isPast = i < today
            const isActive = isPast || isToday
            
            return (
              <div key={day} className="flex-1 text-center">
                <div className="text-xs text-navy-500 mb-2">{day}</div>
                <div
                  className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm transition-all ${
                    isToday
                      ? 'bg-primary-500 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-navy-900'
                      : isActive
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'bg-navy-800 text-navy-600'
                  }`}
                >
                  {isActive ? '✓' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="text-sm text-navy-400 mb-3">Achievements</div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = streakData.achievements.find(a => a.id === achievement.id)
            return (
              <div
                key={achievement.id}
                className={`flex-shrink-0 w-16 text-center transition-all ${
                  unlocked ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
                title={`${achievement.title}: ${achievement.description}`}
              >
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-1 ${
                  unlocked ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-navy-800'
                }`}>
                  {achievement.icon}
                </div>
                <div className="text-xs text-navy-400 truncate">{achievement.title}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}