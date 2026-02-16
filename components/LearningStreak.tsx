'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  lessonsCompleted: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', threshold: 1 },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 day streak', threshold: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚔️', description: '7 day streak', threshold: 7 },
  { id: 'lessons_5', name: 'Knowledge Seeker', icon: '📚', description: 'Complete 5 lessons', threshold: 5 },
  { id: 'lessons_10', name: 'Scholar', icon: '🎓', description: 'Complete 10 lessons', threshold: 10 },
  { id: 'streak_30', name: 'Dedication Master', icon: '🏆', description: '30 day streak', threshold: 30 },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastVisitDate === yesterday) {
        // Continuing streak
        const newData = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
        }
        checkForNewAchievements(data, newData)
        setStreakData(newData)
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
      } else {
        // Streak broken, start fresh
        const newData = {
          ...data,
          currentStreak: 1,
          lastVisit: today,
        }
        setStreakData(newData)
        localStorage.setItem('learnhub_streak', JSON.stringify(newData))
      }
    } else {
      // First visit
      const initialData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        lessonsCompleted: 0,
        achievements: [],
      }
      setStreakData(initialData)
      localStorage.setItem('learnhub_streak', JSON.stringify(initialData))
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [])

  const checkForNewAchievements = (oldData: StreakData, newData: StreakData) => {
    const newAchievements: string[] = []
    
    ACHIEVEMENTS.forEach(achievement => {
      if (!oldData.achievements.includes(achievement.id)) {
        if (
          (achievement.id.startsWith('streak_') && newData.currentStreak >= achievement.threshold) ||
          (achievement.id.startsWith('lessons_') && newData.lessonsCompleted >= achievement.threshold) ||
          (achievement.id === 'first_lesson' && newData.lessonsCompleted >= 1)
        ) {
          newAchievements.push(achievement.id)
          setNewAchievement(achievement)
          setTimeout(() => setNewAchievement(null), 4000)
        }
      }
    })
    
    if (newAchievements.length > 0) {
      newData.achievements = [...oldData.achievements, ...newAchievements]
    }
  }

  if (!streakData) return null

  const earnedAchievements = ACHIEVEMENTS.filter(a => streakData.achievements.includes(a.id))

  return (
    <>
      {/* Floating Streak Indicator */}
      <div 
        className="fixed bottom-24 right-6 z-40"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div 
          className={`
            relative bg-gradient-to-br from-orange-500 to-red-500 
            rounded-full w-16 h-16 flex items-center justify-center
            shadow-lg shadow-orange-500/30 cursor-pointer
            transition-all duration-300 hover:scale-110
            ${isAnimating ? 'animate-bounce' : ''}
          `}
        >
          <div className="text-center">
            <span className="text-2xl">🔥</span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-orange-600 text-xs font-bold px-2 rounded-full shadow">
              {streakData.currentStreak}
            </span>
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping" />
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 w-72 bg-navy-900 border border-navy-700 rounded-xl p-4 shadow-xl animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔥</span>
              <div>
                <div className="text-white font-semibold">{streakData.currentStreak} Day Streak!</div>
                <div className="text-navy-400 text-sm">Best: {streakData.longestStreak} days</div>
              </div>
            </div>
            
            <div className="border-t border-navy-700 pt-3 mt-3">
              <div className="text-navy-400 text-sm mb-2">Achievements Earned</div>
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.length > 0 ? (
                  earnedAchievements.map(achievement => (
                    <span 
                      key={achievement.id}
                      className="text-xl cursor-help"
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      {achievement.icon}
                    </span>
                  ))
                ) : (
                  <span className="text-navy-500 text-sm">Start learning to earn badges!</span>
                )}
              </div>
            </div>

            <div className="border-t border-navy-700 pt-3 mt-3">
              <div className="text-navy-400 text-xs">
                Keep your streak alive by visiting daily! 📈
              </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-navy-900 border-r border-b border-navy-700 rotate-45" />
          </div>
        )}
      </div>

      {/* New Achievement Popup */}
      {newAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-2xl p-8 text-center animate-achievement shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">{newAchievement.icon}</div>
            <div className="text-yellow-400 text-sm font-medium mb-1">Achievement Unlocked!</div>
            <div className="text-white text-xl font-bold mb-2">{newAchievement.name}</div>
            <div className="text-navy-300 text-sm">{newAchievement.description}</div>
          </div>
        </div>
      )}
    </>
  )
}