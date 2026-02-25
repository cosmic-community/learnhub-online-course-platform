'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  requirement: number
  type: 'streak' | 'courses' | 'lessons' | 'days'
  unlockedAt?: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-visit',
    title: 'Welcome Aboard',
    description: 'Started your learning journey',
    emoji: '🌟',
    requirement: 1,
    type: 'days'
  },
  {
    id: 'streak-3',
    title: 'Three-peat',
    description: '3 day learning streak',
    emoji: '🔥',
    requirement: 3,
    type: 'streak'
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: '7 day learning streak',
    emoji: '⚔️',
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: '30 day learning streak',
    emoji: '👑',
    requirement: 30,
    type: 'streak'
  },
  {
    id: 'lessons-5',
    title: 'Getting Started',
    description: 'Completed 5 lessons',
    emoji: '📖',
    requirement: 5,
    type: 'lessons'
  },
  {
    id: 'lessons-25',
    title: 'Knowledge Seeker',
    description: 'Completed 25 lessons',
    emoji: '🎓',
    requirement: 25,
    type: 'lessons'
  },
  {
    id: 'lessons-100',
    title: 'Learning Machine',
    description: 'Completed 100 lessons',
    emoji: '🤖',
    requirement: 100,
    type: 'lessons'
  },
]

interface AchievementBadgeProps {
  showAll?: boolean
  compact?: boolean
}

export default function AchievementBadge({ showAll = false, compact = false }: AchievementBadgeProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null)

  useEffect(() => {
    // Load unlocked achievements
    const stored = localStorage.getItem('learnhub-achievements')
    const unlocked = stored ? JSON.parse(stored) : ['first-visit']
    setUnlockedAchievements(unlocked)
    
    // Check for new achievements based on streak data
    const streakData = localStorage.getItem('learnhub-streak')
    if (streakData) {
      const { currentStreak, totalDaysLearning } = JSON.parse(streakData)
      
      // Check streak achievements
      const newUnlocks: string[] = []
      ACHIEVEMENTS.forEach(achievement => {
        if (unlocked.includes(achievement.id)) return
        
        if (achievement.type === 'streak' && currentStreak >= achievement.requirement) {
          newUnlocks.push(achievement.id)
        }
        if (achievement.type === 'days' && totalDaysLearning >= achievement.requirement) {
          newUnlocks.push(achievement.id)
        }
      })
      
      if (newUnlocks.length > 0) {
        const allUnlocked = [...unlocked, ...newUnlocks]
        localStorage.setItem('learnhub-achievements', JSON.stringify(allUnlocked))
        setUnlockedAchievements(allUnlocked)
        
        // Show notification for first new unlock
        const firstNewAchievement = ACHIEVEMENTS.find(a => a.id === newUnlocks[0])
        if (firstNewAchievement) {
          setNewUnlock(firstNewAchievement)
          setTimeout(() => setNewUnlock(null), 5000)
        }
      }
    }
  }, [])

  const achievementsToShow = showAll 
    ? ACHIEVEMENTS 
    : ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).slice(0, 4)

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {achievementsToShow.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id)
          return (
            <div
              key={achievement.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30' 
                  : 'bg-navy-700 opacity-40 grayscale'
              }`}
              title={`${achievement.title}: ${achievement.description}`}
            >
              {achievement.emoji}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* New Achievement Notification */}
      {newUnlock && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="card p-4 bg-gradient-to-r from-primary-500/20 to-yellow-500/20 border-primary-500/50">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">{newUnlock.emoji}</span>
              <div>
                <div className="text-primary-400 text-xs uppercase tracking-wider">Achievement Unlocked!</div>
                <div className="text-white font-bold">{newUnlock.title}</div>
                <div className="text-navy-300 text-sm">{newUnlock.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievementsToShow.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id)
          return (
            <div
              key={achievement.id}
              className={`card p-4 text-center transition-all duration-300 ${
                isUnlocked 
                  ? 'border-primary-500/30 hover:border-primary-500/50' 
                  : 'opacity-50 grayscale'
              }`}
            >
              <div className={`text-4xl mb-2 ${isUnlocked ? 'animate-pulse' : ''}`}>
                {isUnlocked ? achievement.emoji : '🔒'}
              </div>
              <div className="text-white font-medium text-sm">{achievement.title}</div>
              <div className="text-navy-400 text-xs mt-1">{achievement.description}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}