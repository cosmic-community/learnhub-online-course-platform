'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

const achievements: Achievement[] = [
  {
    id: 'first-course',
    icon: '🎓',
    title: 'First Steps',
    description: 'Start your first course',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'fast-learner',
    icon: '⚡',
    title: 'Fast Learner',
    description: 'Complete 3 lessons in one day',
    unlocked: true,
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'dedicated',
    icon: '🔥',
    title: 'Dedicated',
    description: 'Maintain a 7-day streak',
    unlocked: false,
    progress: 4,
    maxProgress: 7
  },
  {
    id: 'explorer',
    icon: '🧭',
    title: 'Explorer',
    description: 'Browse 5 different categories',
    unlocked: false,
    progress: 2,
    maxProgress: 5
  }
]

export default function AchievementBadge() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [animatedIn, setAnimatedIn] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimatedIn(true), 200)
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Achievements
        </h3>
        <span className="text-sm text-navy-400">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className={`relative transition-all duration-500 ${
              animatedIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
            onMouseEnter={() => setHoveredId(achievement.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-110'
                  : 'bg-navy-800 grayscale hover:scale-105'
              }`}
            >
              {achievement.icon}
              {!achievement.unlocked && (
                <div className="absolute inset-0 rounded-xl bg-navy-900/60 flex items-center justify-center">
                  <span className="text-lg">🔒</span>
                </div>
              )}
            </div>

            {/* Progress bar for locked achievements */}
            {!achievement.unlocked && achievement.progress !== undefined && (
              <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-1000"
                  style={{
                    width: animatedIn ? `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` : '0%'
                  }}
                />
              </div>
            )}

            {/* Tooltip */}
            {hoveredId === achievement.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-navy-800 rounded-lg shadow-xl z-20 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                <p className="text-white font-medium text-sm">{achievement.title}</p>
                <p className="text-navy-400 text-xs mt-1">{achievement.description}</p>
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <p className="text-primary-400 text-xs mt-2">
                    Progress: {achievement.progress}/{achievement.maxProgress}
                  </p>
                )}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="border-8 border-transparent border-t-navy-800" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}