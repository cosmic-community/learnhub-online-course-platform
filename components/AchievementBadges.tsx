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
    id: 'first-step',
    icon: '👣',
    title: 'First Steps',
    description: 'Start your first course',
    unlocked: true,
  },
  {
    id: 'explorer',
    icon: '🧭',
    title: 'Explorer',
    description: 'Browse 5 different categories',
    unlocked: true,
  },
  {
    id: 'quick-learner',
    icon: '⚡',
    title: 'Quick Learner',
    description: 'Complete a lesson in under 10 minutes',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'dedicated',
    icon: '📅',
    title: 'Dedicated',
    description: 'Learn 7 days in a row',
    unlocked: false,
    progress: 3,
    maxProgress: 7,
  },
  {
    id: 'scholar',
    icon: '🎓',
    title: 'Scholar',
    description: 'Complete your first course',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: 'night-owl',
    icon: '🦉',
    title: 'Night Owl',
    description: 'Study after midnight',
    unlocked: false,
  },
]

function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-110 ${
        achievement.unlocked ? '' : 'grayscale opacity-60 hover:opacity-80'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
        achievement.unlocked 
          ? 'bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/30' 
          : 'bg-navy-800 border-2 border-navy-700 border-dashed'
      }`}>
        {achievement.icon}
      </div>
      
      {/* Progress ring for locked achievements with progress */}
      {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
        <svg className="absolute inset-0 w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary-500/30"
            strokeDasharray={`${(achievement.progress / achievement.maxProgress) * 188.5} 188.5`}
            strokeLinecap="round"
          />
        </svg>
      )}
      
      {/* Sparkle effect for unlocked badges */}
      {achievement.unlocked && (
        <span className="absolute -top-1 -right-1 text-sm animate-pulse">✨</span>
      )}
      
      {/* Tooltip */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-200 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 text-center min-w-[140px] shadow-xl">
          <p className="font-semibold text-white text-sm">{achievement.title}</p>
          <p className="text-navy-400 text-xs mt-1">{achievement.description}</p>
          {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
            <p className="text-primary-400 text-xs mt-1 font-medium">
              {achievement.progress}/{achievement.maxProgress}
            </p>
          )}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-navy-800" />
      </div>
    </div>
  )
}

export default function AchievementBadges() {
  const [isVisible, setIsVisible] = useState(false)
  const unlockedCount = achievements.filter(a => a.unlocked).length
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Achievements</h3>
          <p className="text-navy-400 text-sm">{unlockedCount} of {achievements.length} unlocked</p>
        </div>
        <div className="text-2xl">🏆</div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {achievements.map((achievement, index) => (
          <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
        ))}
      </div>
    </div>
  )
}