'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'streak_3', title: 'Consistent', description: 'Maintain a 3-day streak', icon: '🔥' },
  { id: 'streak_7', title: 'Dedicated', description: 'Maintain a 7-day streak', icon: '⭐' },
  { id: 'lessons_5', title: 'Quick Learner', description: 'Complete 5 lessons', icon: '📚' },
  { id: 'lessons_10', title: 'Knowledge Seeker', description: 'Complete 10 lessons', icon: '🧠' },
  { id: 'lessons_25', title: 'Scholar', description: 'Complete 25 lessons', icon: '🎓' },
  { id: 'early_bird', title: 'Early Bird', description: 'Learn before 8 AM', icon: '🌅' },
  { id: 'night_owl', title: 'Night Owl', description: 'Learn after 10 PM', icon: '🦉' },
]

const ACHIEVEMENTS_KEY = 'learnhub_achievements'

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    const unlockedMap: Record<string, string> = stored ? JSON.parse(stored) : {}
    
    const achievementList = ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: !!unlockedMap[a.id],
      unlockedAt: unlockedMap[a.id],
    }))
    
    setAchievements(achievementList)
  }, [])
  
  const checkAndUnlock = (achievementId: string) => {
    if (typeof window === 'undefined') return false
    
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
    const unlockedMap: Record<string, string> = stored ? JSON.parse(stored) : {}
    
    if (unlockedMap[achievementId]) return false
    
    unlockedMap[achievementId] = new Date().toISOString()
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedMap))
    
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (achievement) {
      const unlocked = { ...achievement, unlocked: true, unlockedAt: unlockedMap[achievementId] }
      setNewUnlock(unlocked)
      
      setAchievements(prev => prev.map(a => 
        a.id === achievementId ? unlocked : a
      ))
      
      setTimeout(() => setNewUnlock(null), 4000)
      return true
    }
    
    return false
  }
  
  return { achievements, newUnlock, checkAndUnlock, setNewUnlock }
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }
  
  return (
    <div className="group relative">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
          achievement.unlocked
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 cursor-pointer hover:scale-110'
            : 'bg-navy-800 grayscale opacity-50'
        }`}
      >
        <span className={achievement.unlocked ? '' : 'opacity-30'}>{achievement.icon}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-navy-700">
        <p className="text-sm font-medium text-white">{achievement.title}</p>
        <p className="text-xs text-navy-400">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs text-primary-400 mt-1">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}

export function AchievementToast({ achievement, onClose }: { achievement: Achievement; onClose: () => void }) {
  return (
    <div className="fixed bottom-24 right-5 z-50 animate-slide-up">
      <div className="card p-4 bg-gradient-to-r from-primary-900/90 to-navy-900/90 border-primary-500/50 backdrop-blur-sm shadow-xl max-w-sm">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-navy-400 hover:text-white"
        >
          ×
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl shadow-lg animate-bounce">
            {achievement.icon}
          </div>
          <div>
            <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Achievement Unlocked!</p>
            <p className="text-lg font-bold text-white">{achievement.title}</p>
            <p className="text-sm text-navy-300">{achievement.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AchievementsDisplay() {
  const { achievements } = useAchievements()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-24 bg-navy-800 rounded"></div>
      </div>
    )
  }
  
  const unlockedCount = achievements.filter(a => a.unlocked).length
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Achievements
        </h3>
        <span className="text-sm text-navy-400">
          {unlockedCount}/{achievements.length}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} size="sm" />
        ))}
      </div>
      
      {unlockedCount === 0 && (
        <p className="text-center text-navy-400 text-sm mt-4">
          Complete lessons to unlock achievements!
        </p>
      )}
    </div>
  )
}