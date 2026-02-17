'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  requirement: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_visit',
    title: 'Welcome Explorer',
    description: 'Visited LearnHub for the first time',
    icon: '🎉',
    unlocked: false,
    requirement: 'visit'
  },
  {
    id: 'course_viewer',
    title: 'Curious Mind',
    description: 'Viewed your first course',
    icon: '👀',
    unlocked: false,
    requirement: 'view_course'
  },
  {
    id: 'category_explorer',
    title: 'Category Explorer',
    description: 'Browsed through categories',
    icon: '🗂️',
    unlocked: false,
    requirement: 'view_categories'
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    description: 'Maintained a 3-day streak',
    icon: '⭐',
    unlocked: false,
    requirement: 'streak_3'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🏅',
    unlocked: false,
    requirement: 'streak_7'
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintained a 30-day streak',
    icon: '🏆',
    unlocked: false,
    requirement: 'streak_30'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Studied after midnight',
    icon: '🦉',
    unlocked: false,
    requirement: 'night_visit'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Studied before 7 AM',
    icon: '🐦',
    unlocked: false,
    requirement: 'early_visit'
  }
]

const STORAGE_KEY = 'learnhub_achievements'

function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return ACHIEVEMENTS
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const savedAchievements = JSON.parse(stored) as Achievement[]
    // Merge with base achievements in case new ones were added
    return ACHIEVEMENTS.map(achievement => {
      const saved = savedAchievements.find(a => a.id === achievement.id)
      return saved ? { ...achievement, unlocked: saved.unlocked, unlockedAt: saved.unlockedAt } : achievement
    })
  }
  
  return ACHIEVEMENTS
}

function checkAndUnlockAchievement(achievements: Achievement[], id: string): Achievement[] {
  return achievements.map(a => {
    if (a.id === id && !a.unlocked) {
      return { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
    }
    return a
  })
}

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null)

  useEffect(() => {
    let currentAchievements = getAchievements()
    
    // Check first visit
    currentAchievements = checkAndUnlockAchievement(currentAchievements, 'first_visit')
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5) {
      currentAchievements = checkAndUnlockAchievement(currentAchievements, 'night_owl')
    }
    if (hour >= 5 && hour < 7) {
      currentAchievements = checkAndUnlockAchievement(currentAchievements, 'early_bird')
    }
    
    // Check streak achievements from localStorage
    const streakData = localStorage.getItem('learnhub_streak')
    if (streakData) {
      const { currentStreak } = JSON.parse(streakData)
      if (currentStreak >= 3) {
        currentAchievements = checkAndUnlockAchievement(currentAchievements, 'streak_3')
      }
      if (currentStreak >= 7) {
        currentAchievements = checkAndUnlockAchievement(currentAchievements, 'streak_7')
      }
      if (currentStreak >= 30) {
        currentAchievements = checkAndUnlockAchievement(currentAchievements, 'streak_30')
      }
    }
    
    // Check for newly unlocked achievements
    const oldAchievements = getAchievements()
    const newlyUnlocked = currentAchievements.find(
      a => a.unlocked && !oldAchievements.find(oa => oa.id === a.id)?.unlocked
    )
    
    if (newlyUnlocked) {
      setNewUnlock(newlyUnlocked)
      setTimeout(() => setNewUnlock(null), 3000)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAchievements))
    setAchievements(currentAchievements)
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <>
      {/* New Achievement Popup */}
      {newUnlock && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className="card p-4 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 border-primary-500/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">{newUnlock.icon}</span>
              <div>
                <div className="text-sm text-primary-400 font-semibold">Achievement Unlocked!</div>
                <div className="text-white font-bold">{newUnlock.title}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🏆</span> Achievements
          </h3>
          <span className="text-sm text-navy-400">
            {unlockedCount}/{totalCount} unlocked
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-navy-800 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-primary-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative group cursor-pointer ${
                achievement.unlocked ? '' : 'opacity-40 grayscale'
              }`}
              title={achievement.unlocked ? achievement.title : '???'}
            >
              <div className={`
                w-full aspect-square rounded-xl flex items-center justify-center text-2xl
                transition-all duration-300
                ${achievement.unlocked 
                  ? 'bg-gradient-to-br from-navy-700 to-navy-800 hover:from-primary-500/20 hover:to-yellow-500/20' 
                  : 'bg-navy-800'}
              `}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 text-center whitespace-nowrap">
                  <div className="text-xs font-semibold text-white">
                    {achievement.unlocked ? achievement.title : '???'}
                  </div>
                  <div className="text-xs text-navy-400">
                    {achievement.unlocked ? achievement.description : 'Keep learning to unlock!'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}