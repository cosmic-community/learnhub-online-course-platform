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

const ACHIEVEMENTS_KEY = 'learnhub_achievements'

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_visit', title: 'First Steps', description: 'Welcome to LearnHub!', icon: '👋', requirement: 'Visit the site' },
  { id: 'explorer', title: 'Explorer', description: 'Checked out 3+ courses', icon: '🔍', requirement: 'Browse courses' },
  { id: 'streak_3', title: 'Consistent', description: '3 day learning streak', icon: '⚡', requirement: '3 day streak' },
  { id: 'streak_7', title: 'Dedicated', description: '7 day learning streak', icon: '🔥', requirement: '7 day streak' },
  { id: 'streak_14', title: 'Committed', description: '14 day learning streak', icon: '💎', requirement: '14 day streak' },
  { id: 'streak_30', title: 'Legend', description: '30 day learning streak', icon: '🏆', requirement: '30 day streak' },
  { id: 'night_owl', title: 'Night Owl', description: 'Learning after midnight', icon: '🦉', requirement: 'Visit late at night' },
  { id: 'early_bird', title: 'Early Bird', description: 'Learning before 7am', icon: '🐦', requirement: 'Visit early morning' },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Learning on weekends', icon: '⚔️', requirement: 'Learn on weekend' },
]

function getStoredAchievements(): Achievement[] {
  if (typeof window === 'undefined') {
    return achievementDefinitions.map(a => ({ ...a, unlocked: false }))
  }
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  if (!stored) {
    return achievementDefinitions.map(a => ({ ...a, unlocked: false }))
  }
  
  try {
    const parsed = JSON.parse(stored) as Record<string, string>
    return achievementDefinitions.map(a => ({
      ...a,
      unlocked: !!parsed[a.id],
      unlockedAt: parsed[a.id]
    }))
  } catch {
    return achievementDefinitions.map(a => ({ ...a, unlocked: false }))
  }
}

function unlockAchievement(id: string): void {
  if (typeof window === 'undefined') return
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  const achievements = stored ? JSON.parse(stored) as Record<string, string> : {}
  
  if (!achievements[id]) {
    achievements[id] = new Date().toISOString()
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
  }
}

function checkAchievements(): string[] {
  const newlyUnlocked: string[] = []
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  
  // First visit
  unlockAchievement('first_visit')
  
  // Time-based achievements
  if (hour >= 0 && hour < 5) {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    const achievements = stored ? JSON.parse(stored) as Record<string, string> : {}
    if (!achievements['night_owl']) {
      newlyUnlocked.push('night_owl')
      unlockAchievement('night_owl')
    }
  }
  
  if (hour >= 5 && hour < 7) {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    const achievements = stored ? JSON.parse(stored) as Record<string, string> : {}
    if (!achievements['early_bird']) {
      newlyUnlocked.push('early_bird')
      unlockAchievement('early_bird')
    }
  }
  
  if (day === 0 || day === 6) {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    const achievements = stored ? JSON.parse(stored) as Record<string, string> : {}
    if (!achievements['weekend_warrior']) {
      newlyUnlocked.push('weekend_warrior')
      unlockAchievement('weekend_warrior')
    }
  }
  
  // Streak-based achievements (check from streak data)
  const streakData = localStorage.getItem('learnhub_streak_data')
  if (streakData) {
    try {
      const streak = JSON.parse(streakData)
      const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
      const achievements = stored ? JSON.parse(stored) as Record<string, string> : {}
      
      if (streak.currentStreak >= 3 && !achievements['streak_3']) {
        newlyUnlocked.push('streak_3')
        unlockAchievement('streak_3')
      }
      if (streak.currentStreak >= 7 && !achievements['streak_7']) {
        newlyUnlocked.push('streak_7')
        unlockAchievement('streak_7')
      }
      if (streak.currentStreak >= 14 && !achievements['streak_14']) {
        newlyUnlocked.push('streak_14')
        unlockAchievement('streak_14')
      }
      if (streak.currentStreak >= 30 && !achievements['streak_30']) {
        newlyUnlocked.push('streak_30')
        unlockAchievement('streak_30')
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  return newlyUnlocked
}

interface AchievementBadgesProps {
  compact?: boolean
}

export default function AchievementBadges({ compact = false }: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlocks, setNewUnlocks] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    const newlyUnlocked = checkAchievements()
    setAchievements(getStoredAchievements())
    setNewUnlocks(newlyUnlocked)
    
    // Show toast for first new unlock
    if (newlyUnlocked.length > 0) {
      const achievement = achievementDefinitions.find(a => a.id === newlyUnlocked[0])
      if (achievement) {
        setToastAchievement({ ...achievement, unlocked: true })
        setShowToast(true)
        setTimeout(() => setShowToast(false), 4000)
      }
    }
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (compact) {
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white text-sm">Achievements</h3>
          <span className="text-xs text-navy-400">{unlockedCount}/{achievements.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {achievements.slice(0, 6).map((achievement) => (
            <div
              key={achievement.id}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                achievement.unlocked
                  ? 'bg-primary-500/20 scale-100'
                  : 'bg-navy-800/50 grayscale opacity-40'
              } ${newUnlocks.includes(achievement.id) ? 'animate-bounce' : ''}`}
              title={achievement.unlocked ? achievement.title : '???'}
            >
              {achievement.icon}
            </div>
          ))}
          {achievements.length > 6 && (
            <div className="w-8 h-8 rounded-lg bg-navy-800/50 flex items-center justify-center text-xs text-navy-400">
              +{achievements.length - 6}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && toastAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="card p-4 flex items-center gap-3 shadow-xl border-primary-500/50">
            <span className="text-3xl animate-bounce">{toastAchievement.icon}</span>
            <div>
              <div className="text-xs text-primary-400 font-medium">Achievement Unlocked!</div>
              <div className="text-white font-semibold">{toastAchievement.title}</div>
              <div className="text-xs text-navy-400">{toastAchievement.description}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Achievements</h3>
          <span className="text-sm text-navy-400">
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group relative flex flex-col items-center p-3 rounded-xl transition-all ${
                achievement.unlocked
                  ? 'bg-primary-500/10 hover:bg-primary-500/20'
                  : 'bg-navy-800/30 opacity-50'
              } ${newUnlocks.includes(achievement.id) ? 'ring-2 ring-primary-500 animate-pulse' : ''}`}
            >
              <span className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.icon}
              </span>
              <span className={`text-xs text-center font-medium ${
                achievement.unlocked ? 'text-white' : 'text-navy-500'
              }`}>
                {achievement.unlocked ? achievement.title : '???'}
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium text-white">{achievement.title}</div>
                <div className="text-navy-400">{achievement.description}</div>
                {!achievement.unlocked && (
                  <div className="text-primary-400 mt-1">Hint: {achievement.requirement}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}