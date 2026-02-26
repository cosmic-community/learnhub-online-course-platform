'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = {
  first_visit: { emoji: '🎉', title: 'Welcome!', description: 'Started your learning journey' },
  three_day_streak: { emoji: '🔥', title: 'On Fire!', description: '3-day learning streak' },
  week_streak: { emoji: '⚡', title: 'Unstoppable', description: '7-day learning streak' },
  explorer: { emoji: '🗺️', title: 'Explorer', description: 'Visited 5 different pages' },
  night_owl: { emoji: '🦉', title: 'Night Owl', description: 'Learning after midnight' },
  early_bird: { emoji: '🐦', title: 'Early Bird', description: 'Learning before 7 AM' },
  dedicated: { emoji: '💎', title: 'Dedicated', description: '10 total site visits' },
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [showAchievement, setShowAchievement] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    const currentHour = new Date().getHours()
    
    let data: StreakData = stored 
      ? JSON.parse(stored)
      : { currentStreak: 0, lastVisit: '', totalVisits: 0, achievements: [] }

    // Check if this is a new day
    if (data.lastVisit !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (data.lastVisit === yesterday.toDateString()) {
        // Consecutive day - increase streak
        data.currentStreak += 1
      } else if (data.lastVisit !== '') {
        // Streak broken
        data.currentStreak = 1
      } else {
        // First visit ever
        data.currentStreak = 1
      }
      
      data.lastVisit = today
      data.totalVisits += 1

      // Check for new achievements
      const newAchievements: string[] = []
      
      if (!data.achievements.includes('first_visit')) {
        data.achievements.push('first_visit')
        newAchievements.push('first_visit')
      }
      
      if (data.currentStreak >= 3 && !data.achievements.includes('three_day_streak')) {
        data.achievements.push('three_day_streak')
        newAchievements.push('three_day_streak')
      }
      
      if (data.currentStreak >= 7 && !data.achievements.includes('week_streak')) {
        data.achievements.push('week_streak')
        newAchievements.push('week_streak')
      }
      
      if (data.totalVisits >= 10 && !data.achievements.includes('dedicated')) {
        data.achievements.push('dedicated')
        newAchievements.push('dedicated')
      }
      
      if (currentHour >= 0 && currentHour < 5 && !data.achievements.includes('night_owl')) {
        data.achievements.push('night_owl')
        newAchievements.push('night_owl')
      }
      
      if (currentHour >= 5 && currentHour < 7 && !data.achievements.includes('early_bird')) {
        data.achievements.push('early_bird')
        newAchievements.push('early_bird')
      }

      localStorage.setItem('learnhub-streak', JSON.stringify(data))
      
      // Show the first new achievement with animation
      if (newAchievements.length > 0) {
        setTimeout(() => {
          setNewAchievement(newAchievements[0])
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 4000)
        }, 1500)
      }
    }
    
    setStreakData(data)
  }, [])

  if (!streakData) return null

  return (
    <>
      {/* Streak Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
        <span className="text-2xl animate-pulse">🔥</span>
        <span className="text-white font-semibold">{streakData.currentStreak} day streak</span>
        {streakData.achievements.length > 0 && (
          <div className="flex -space-x-1 ml-2">
            {streakData.achievements.slice(0, 3).map((achievementKey) => {
              const achievement = ACHIEVEMENTS[achievementKey as keyof typeof ACHIEVEMENTS]
              return achievement ? (
                <span 
                  key={achievementKey} 
                  className="text-lg cursor-help transition-transform hover:scale-125"
                  title={`${achievement.title}: ${achievement.description}`}
                >
                  {achievement.emoji}
                </span>
              ) : null
            })}
            {streakData.achievements.length > 3 && (
              <span className="text-xs text-navy-400 ml-2">+{streakData.achievements.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Achievement Popup */}
      {showAchievement && newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl border border-yellow-400/50">
            <div className="flex items-center gap-3">
              <span className="text-4xl">
                {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].emoji}
              </span>
              <div>
                <p className="text-white font-bold text-lg">Achievement Unlocked!</p>
                <p className="text-yellow-100 font-medium">
                  {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].title}
                </p>
                <p className="text-yellow-200 text-sm">
                  {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}