'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'progress'>[] = [
  { id: 'first_course', name: 'First Steps', description: 'View your first course', icon: '👣', maxProgress: 1, rarity: 'common' },
  { id: 'explorer', name: 'Explorer', description: 'Browse 5 different courses', icon: '🧭', maxProgress: 5, rarity: 'common' },
  { id: 'dedicated', name: 'Dedicated Learner', description: 'Maintain a 7-day streak', icon: '🔥', maxProgress: 7, rarity: 'rare' },
  { id: 'category_master', name: 'Category Master', description: 'Explore all categories', icon: '🎯', maxProgress: 5, rarity: 'rare' },
  { id: 'night_owl', name: 'Night Owl', description: 'Study after 10 PM', icon: '🦉', maxProgress: 1, rarity: 'common' },
  { id: 'early_bird', name: 'Early Bird', description: 'Study before 7 AM', icon: '🐦', maxProgress: 1, rarity: 'common' },
  { id: 'code_warrior', name: 'Code Warrior', description: 'View 10 code examples', icon: '⚔️', maxProgress: 10, rarity: 'epic' },
  { id: 'legend', name: 'Learning Legend', description: '30-day streak achieved!', icon: '👑', maxProgress: 30, rarity: 'legendary' },
]

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
}

const RARITY_GLOW = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50',
}

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null)
  const [newUnlock, setNewUnlock] = useState<string | null>(null)

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem('achievements-progress')
    const progress: Record<string, number> = saved ? JSON.parse(saved) : {}
    
    // Check time-based achievements
    const hour = new Date().getHours()
    if (hour >= 22 || hour < 4) {
      progress['night_owl'] = 1
    }
    if (hour >= 5 && hour < 7) {
      progress['early_bird'] = 1
    }
    
    // Check streak achievement
    const streakData = localStorage.getItem('learning-streak')
    if (streakData) {
      const { currentStreak } = JSON.parse(streakData)
      progress['dedicated'] = Math.min(currentStreak, 7)
      progress['legend'] = Math.min(currentStreak, 30)
    }
    
    // Increment exploration
    progress['first_course'] = Math.min((progress['first_course'] || 0) + 1, 1)
    progress['explorer'] = Math.min((progress['explorer'] || 0) + 1, 5)
    
    const achievementList = ACHIEVEMENTS.map(a => ({
      ...a,
      progress: progress[a.id] || 0,
      unlocked: (progress[a.id] || 0) >= a.maxProgress,
    }))
    
    setAchievements(achievementList)
    localStorage.setItem('achievements-progress', JSON.stringify(progress))
    
    // Check for new unlocks
    const previousUnlocks = localStorage.getItem('unlocked-achievements')
    const previousList: string[] = previousUnlocks ? JSON.parse(previousUnlocks) : []
    const newUnlocks = achievementList.filter(a => a.unlocked && !previousList.includes(a.id))
    
    if (newUnlocks.length > 0) {
      setNewUnlock(newUnlocks[0].id)
      localStorage.setItem('unlocked-achievements', JSON.stringify(achievementList.filter(a => a.unlocked).map(a => a.id)))
      setTimeout(() => setNewUnlock(null), 3000)
    }
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="rounded-2xl bg-navy-900/50 border border-navy-800 p-6">
      {/* New unlock celebration */}
      {newUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900/95 border-2 border-yellow-500 rounded-2xl p-8 text-center animate-bounce shadow-2xl shadow-yellow-500/30">
            <div className="text-6xl mb-4 animate-pulse">
              {achievements.find(a => a.id === newUnlock)?.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-yellow-400 font-semibold">
              {achievements.find(a => a.id === newUnlock)?.name}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Achievements
        </h3>
        <span className="text-sm text-navy-400">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement) => (
          <button
            key={achievement.id}
            onClick={() => setSelectedBadge(selectedBadge?.id === achievement.id ? null : achievement)}
            className={`relative group aspect-square rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
              achievement.unlocked
                ? `bg-gradient-to-br ${RARITY_COLORS[achievement.rarity]} shadow-lg ${RARITY_GLOW[achievement.rarity]} hover:scale-110`
                : 'bg-navy-800/50 grayscale opacity-50 hover:opacity-70'
            }`}
          >
            <span className={achievement.unlocked ? 'animate-pulse' : ''}>
              {achievement.icon}
            </span>
            {!achievement.unlocked && achievement.progress > 0 && (
              <div className="absolute bottom-1 left-1 right-1 h-1 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            )}
            {achievement.rarity === 'legendary' && achievement.unlocked && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-yellow-500/20 to-transparent animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* Badge detail tooltip */}
      {selectedBadge && (
        <div className="mt-4 p-4 rounded-xl bg-navy-800/50 border border-navy-700 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedBadge.icon}</span>
            <div>
              <h4 className="font-semibold text-white">{selectedBadge.name}</h4>
              <p className="text-sm text-navy-400">{selectedBadge.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${RARITY_COLORS[selectedBadge.rarity]} text-white capitalize`}>
                  {selectedBadge.rarity}
                </span>
                {!selectedBadge.unlocked && (
                  <span className="text-xs text-navy-400">
                    {selectedBadge.progress}/{selectedBadge.maxProgress}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}