'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  unlocked: boolean
  progress: number
  target: number
  color: string
}

const ACHIEVEMENTS_KEY = 'learnhub_achievements'

const achievementDefinitions = [
  {
    id: 'first_visit',
    title: 'Explorer',
    description: 'Visit the platform for the first time',
    emoji: '🧭',
    target: 1,
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'course_viewer',
    title: 'Curious Mind',
    description: 'View 3 different courses',
    emoji: '👀',
    target: 3,
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Learn after 10 PM',
    emoji: '🦉',
    target: 1,
    color: 'from-indigo-500 to-indigo-700'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Learn before 7 AM',
    emoji: '🌅',
    target: 1,
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'category_explorer',
    title: 'Category Explorer',
    description: 'Browse all categories',
    emoji: '🗺️',
    target: 5,
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Visit 5 days in a row',
    emoji: '📚',
    target: 5,
    color: 'from-red-500 to-red-700'
  }
]

function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') {
    return achievementDefinitions.map(def => ({
      ...def,
      unlocked: false,
      progress: 0
    }))
  }
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  const progress = stored ? JSON.parse(stored) : {}
  
  return achievementDefinitions.map(def => ({
    ...def,
    progress: progress[def.id] || 0,
    unlocked: (progress[def.id] || 0) >= def.target
  }))
}

function updateAchievement(id: string, increment: number = 1): Achievement[] {
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  const progress = stored ? JSON.parse(stored) : {}
  
  progress[id] = Math.min((progress[id] || 0) + increment, 
    achievementDefinitions.find(a => a.id === id)?.target || 1)
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(progress))
  return getAchievements()
}

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null)
  
  useEffect(() => {
    // Initialize and check for first visit
    const current = getAchievements()
    const firstVisit = current.find(a => a.id === 'first_visit')
    
    if (firstVisit && !firstVisit.unlocked) {
      const updated = updateAchievement('first_visit')
      setAchievements(updated)
      const unlocked = updated.find(a => a.id === 'first_visit')
      if (unlocked?.unlocked) {
        setNewUnlock(unlocked)
        setTimeout(() => setNewUnlock(null), 4000)
      }
    } else {
      setAchievements(current)
    }
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 4) {
      const nightOwl = current.find(a => a.id === 'night_owl')
      if (nightOwl && !nightOwl.unlocked) {
        const updated = updateAchievement('night_owl')
        setAchievements(updated)
      }
    }
    if (hour >= 5 && hour < 7) {
      const earlyBird = current.find(a => a.id === 'early_bird')
      if (earlyBird && !earlyBird.unlocked) {
        const updated = updateAchievement('early_bird')
        setAchievements(updated)
      }
    }
  }, [])
  
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  
  return (
    <>
      {/* New Achievement Notification */}
      {newUnlock && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`bg-gradient-to-r ${newUnlock.color} p-4 rounded-xl shadow-2xl text-white max-w-xs`}>
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">{newUnlock.emoji}</span>
              <div>
                <p className="text-xs opacity-80">Achievement Unlocked!</p>
                <p className="font-bold">{newUnlock.title}</p>
                <p className="text-xs opacity-80">{newUnlock.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Achievements Display */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🏅</span>
            Achievements
          </h3>
          <span className="text-sm text-primary-400 font-medium">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-navy-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        
        {/* Achievement Grid */}
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} shadow-lg`
                  : 'bg-navy-800/50 opacity-50 grayscale'
              }`}
              title={achievement.description}
            >
              <span className={`text-2xl block ${achievement.unlocked ? 'animate-pulse' : ''}`}>
                {achievement.emoji}
              </span>
              <p className="text-xs text-white mt-1 font-medium truncate">
                {achievement.title}
              </p>
              {!achievement.unlocked && achievement.progress > 0 && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="h-1 bg-navy-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-400"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}