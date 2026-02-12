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

const ACHIEVEMENTS_KEY = 'learnhub_achievements'

const AVAILABLE_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_visit', title: 'First Steps', description: 'Visited LearnHub for the first time', icon: '👋' },
  { id: 'first_course', title: 'Curious Mind', description: 'Started your first course', icon: '📖' },
  { id: 'first_lesson', title: 'Knowledge Seeker', description: 'Completed your first lesson', icon: '✅' },
  { id: 'streak_3', title: 'Getting Started', description: 'Maintained a 3-day learning streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: '⚡' },
  { id: 'streak_30', title: 'Monthly Master', description: 'Maintained a 30-day learning streak', icon: '🏆' },
  { id: 'five_lessons', title: 'Quick Learner', description: 'Completed 5 lessons', icon: '🎯' },
  { id: 'course_complete', title: 'Graduate', description: 'Completed your first course', icon: '🎓' },
  { id: 'explorer', title: 'Explorer', description: 'Viewed 5 different courses', icon: '🗺️' },
  { id: 'night_owl', title: 'Night Owl', description: 'Learned after midnight', icon: '🦉' },
  { id: 'early_bird', title: 'Early Bird', description: 'Learned before 7am', icon: '🐦' },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Learned on a weekend', icon: '🎮' },
]

export function unlockAchievement(achievementId: string): boolean {
  if (typeof window === 'undefined') return false
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  const achievements: Record<string, { unlockedAt: string }> = stored ? JSON.parse(stored) : {}
  
  if (achievements[achievementId]) return false // Already unlocked
  
  achievements[achievementId] = { unlockedAt: new Date().toISOString() }
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
  
  // Dispatch custom event for notification
  window.dispatchEvent(new CustomEvent('achievement-unlocked', { 
    detail: { achievementId }
  }))
  
  return true
}

export function getUnlockedAchievements(): Achievement[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(ACHIEVEMENTS_KEY)
  const unlocked: Record<string, { unlockedAt: string }> = stored ? JSON.parse(stored) : {}
  
  return AVAILABLE_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: !!unlocked[a.id],
    unlockedAt: unlocked[a.id]?.unlockedAt
  }))
}

export default function AchievementBadge({ achievementId }: { achievementId: string }) {
  const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === achievementId)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const achievements = getUnlockedAchievements()
    const found = achievements.find(a => a.id === achievementId)
    setIsUnlocked(found?.unlocked ?? false)
  }, [achievementId])

  if (!achievement) return null

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
        isUnlocked 
          ? 'bg-primary-500/20 text-primary-400' 
          : 'bg-navy-800 text-navy-500 grayscale'
      }`}
      title={achievement.description}
    >
      <span className={isUnlocked ? '' : 'opacity-50'}>{achievement.icon}</span>
      <span className="font-medium">{achievement.title}</span>
    </div>
  )
}

export function AchievementNotification() {
  const [notification, setNotification] = useState<Achievement | null>(null)

  useEffect(() => {
    const handleAchievement = (event: CustomEvent<{ achievementId: string }>) => {
      const achievement = AVAILABLE_ACHIEVEMENTS.find(a => a.id === event.detail.achievementId)
      if (achievement) {
        setNotification({ ...achievement, unlocked: true })
        setTimeout(() => setNotification(null), 5000)
      }
    }

    window.addEventListener('achievement-unlocked' as never, handleAchievement as EventListener)
    return () => {
      window.removeEventListener('achievement-unlocked' as never, handleAchievement as EventListener)
    }
  }, [])

  if (!notification) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
      <div className="card p-4 flex items-center gap-4 shadow-2xl border-primary-500/50">
        <div className="text-4xl animate-bounce">{notification.icon}</div>
        <div>
          <div className="text-xs text-primary-400 font-medium mb-1">Achievement Unlocked!</div>
          <div className="text-white font-semibold">{notification.title}</div>
          <div className="text-navy-400 text-sm">{notification.description}</div>
        </div>
      </div>
    </div>
  )
}