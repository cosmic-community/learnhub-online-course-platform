'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningStreakProps {
  totalCourses: number
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_visit', name: 'Welcome!', emoji: '👋', requirement: 1, description: 'First visit' },
  { id: 'streak_3', name: 'Getting Started', emoji: '🔥', requirement: 3, description: '3-day streak' },
  { id: 'streak_7', name: 'Week Warrior', emoji: '⚡', requirement: 7, description: '7-day streak' },
  { id: 'streak_14', name: 'Dedicated Learner', emoji: '🌟', requirement: 14, description: '14-day streak' },
  { id: 'streak_30', name: 'Learning Machine', emoji: '🏆', requirement: 30, description: '30-day streak' },
  { id: 'visits_10', name: 'Regular', emoji: '📚', requirement: 10, description: '10 total visits' },
  { id: 'visits_50', name: 'Committed', emoji: '💎', requirement: 50, description: '50 total visits' },
]

export default function LearningStreak({ totalCourses }: LearningStreakProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const checkAchievements = useCallback((data: StreakData): string[] => {
    const newAchievements: string[] = [...data.achievements]
    let earnedNew = false

    ACHIEVEMENTS.forEach(achievement => {
      if (!newAchievements.includes(achievement.id)) {
        let earned = false
        
        if (achievement.id === 'first_visit' && data.totalVisits >= 1) earned = true
        if (achievement.id.startsWith('streak_')) {
          const required = parseInt(achievement.id.split('_')[1])
          if (data.currentStreak >= required) earned = true
        }
        if (achievement.id.startsWith('visits_')) {
          const required = parseInt(achievement.id.split('_')[1])
          if (data.totalVisits >= required) earned = true
        }

        if (earned) {
          newAchievements.push(achievement.id)
          if (!earnedNew) {
            setNewAchievement(achievement)
            setShowConfetti(true)
            earnedNew = true
          }
        }
      }
    })

    return newAchievements
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learningStreak')
    
    let data: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      totalVisits: 0,
      achievements: []
    }

    // Check if this is a new day
    if (data.lastVisit !== today) {
      const lastDate = data.lastVisit ? new Date(data.lastVisit) : null
      const todayDate = new Date(today)
      
      if (lastDate) {
        const diffTime = todayDate.getTime() - lastDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          // Consecutive day - increase streak
          data.currentStreak += 1
        } else if (diffDays > 1) {
          // Streak broken
          data.currentStreak = 1
        }
      } else {
        // First visit ever
        data.currentStreak = 1
      }

      data.totalVisits += 1
      data.lastVisit = today
      data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
    }

    // Check for new achievements
    data.achievements = checkAchievements(data)
    
    localStorage.setItem('learningStreak', JSON.stringify(data))
    setStreakData(data)

    // Clear confetti after animation
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [checkAchievements, showConfetti])

  // Dismiss achievement notification
  const dismissAchievement = () => {
    setNewAchievement(null)
    setShowConfetti(false)
  }

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))
  const nextAchievement = ACHIEVEMENTS.find(a => !streakData.achievements.includes(a.id))

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement notification */}
      {newAchievement && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center bg-navy-900/95 backdrop-blur-sm animate-fade-in"
          onClick={dismissAchievement}
        >
          <div className="text-center p-6 animate-bounce-in">
            <div className="text-6xl mb-4">{newAchievement.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-primary-400 font-semibold text-lg">{newAchievement.name}</p>
            <p className="text-navy-400 text-sm mt-1">{newAchievement.description}</p>
            <button className="mt-4 text-navy-500 text-sm hover:text-navy-300">Click to dismiss</button>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Your Learning Streak
          </h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-400">{streakData.currentStreak}</div>
            <div className="text-xs text-navy-500">day{streakData.currentStreak !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-navy-800/50 rounded-lg p-3">
            <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-3">
            <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
          <div className="bg-navy-800/50 rounded-lg p-3">
            <div className="text-xl font-bold text-white">{totalCourses}</div>
            <div className="text-xs text-navy-400">Courses</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-300">Achievements</span>
            <span className="text-xs text-navy-500">{earnedAchievements.length}/{ACHIEVEMENTS.length}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ACHIEVEMENTS.map(achievement => {
              const earned = streakData.achievements.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`group relative p-2 rounded-lg transition-all ${
                    earned 
                      ? 'bg-primary-500/20 cursor-default' 
                      : 'bg-navy-800/30 grayscale opacity-50'
                  }`}
                  title={earned ? `${achievement.name}: ${achievement.description}` : `Locked: ${achievement.description}`}
                >
                  <span className="text-xl">{achievement.emoji}</span>
                  {earned && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-navy-800 px-2 py-1 rounded text-xs text-white z-10">
                      {achievement.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Next achievement hint */}
          {nextAchievement && (
            <div className="mt-4 p-3 bg-navy-800/30 rounded-lg border border-navy-700/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50 grayscale">{nextAchievement.emoji}</span>
                <div>
                  <div className="text-sm text-navy-300">Next: <span className="text-white">{nextAchievement.name}</span></div>
                  <div className="text-xs text-navy-500">{nextAchievement.description}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}