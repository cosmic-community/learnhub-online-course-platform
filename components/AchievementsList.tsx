'use client'

import { useEffect, useState } from 'react'
import { loadProgress, ACHIEVEMENTS, type Achievement } from '@/lib/progress'

export default function AchievementsList() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const progress = loadProgress()
    setUnlockedAchievements(progress.achievements)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))
  
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
        🏆 Achievements
        <span className="text-sm text-navy-400 font-normal">
          ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </span>
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id)
          const unlocked = unlockedAchievements.find(a => a.id === achievement.id)
          
          return (
            <div
              key={achievement.id}
              className={`relative group ${isUnlocked ? '' : 'opacity-40'}`}
            >
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-primary-500/30 to-primary-600/20 shadow-lg shadow-primary-500/20'
                    : 'bg-navy-800'
                }`}
              >
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 text-center min-w-[140px] shadow-xl">
                  <div className="font-semibold text-white text-sm mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-navy-400 text-xs">
                    {achievement.description}
                  </div>
                  {unlocked?.unlockedAt && (
                    <div className="text-primary-400 text-xs mt-2">
                      ✓ Unlocked {new Date(unlocked.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="w-2 h-2 bg-navy-800 border-r border-b border-navy-700 rotate-45 mx-auto -mt-1" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}