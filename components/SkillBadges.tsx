'use client'

import { useState, useEffect } from 'react'

interface SkillBadgesProps {
  categoryCount: number
  courseCount: number
}

interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  requirement: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

export default function SkillBadges({ categoryCount, courseCount }: SkillBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  useEffect(() => {
    // Get user progress from localStorage
    const visitCount = parseInt(localStorage.getItem('visit-count') || '0') + 1
    localStorage.setItem('visit-count', visitCount.toString())
    
    const coursesViewed = parseInt(localStorage.getItem('courses-viewed') || '0')
    const lessonsCompleted = parseInt(localStorage.getItem('lessons-completed') || '0')
    const streak = parseInt(localStorage.getItem('learning-streak') || '0')

    const allBadges: Badge[] = [
      {
        id: 'explorer',
        name: 'Explorer',
        emoji: '🔍',
        description: 'Started your learning journey',
        requirement: 'Visit the platform',
        unlocked: visitCount >= 1,
        progress: Math.min(visitCount, 1),
        maxProgress: 1,
      },
      {
        id: 'curious',
        name: 'Curious Mind',
        emoji: '🤔',
        description: 'Checked out multiple courses',
        requirement: 'View 3 courses',
        unlocked: coursesViewed >= 3,
        progress: Math.min(coursesViewed, 3),
        maxProgress: 3,
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        emoji: '⭐',
        description: 'Maintained a learning streak',
        requirement: '3-day streak',
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        maxProgress: 3,
      },
      {
        id: 'committed',
        name: 'Committed',
        emoji: '🔥',
        description: 'One full week of learning!',
        requirement: '7-day streak',
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        maxProgress: 7,
      },
      {
        id: 'scholar',
        name: 'Scholar',
        emoji: '📚',
        description: 'Completed your first lesson',
        requirement: 'Complete 1 lesson',
        unlocked: lessonsCompleted >= 1,
        progress: Math.min(lessonsCompleted, 1),
        maxProgress: 1,
      },
      {
        id: 'achiever',
        name: 'Achiever',
        emoji: '🏆',
        description: 'Made significant progress',
        requirement: 'Complete 5 lessons',
        unlocked: lessonsCompleted >= 5,
        progress: Math.min(lessonsCompleted, 5),
        maxProgress: 5,
      },
    ]

    setBadges(allBadges)
  }, [])

  const unlockedCount = badges.filter(b => b.unlocked).length

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">🎖️ Skill Badges</h3>
          <span className="text-sm text-navy-400">
            {unlockedCount}/{badges.length} unlocked
          </span>
        </div>
        
        {/* Badge grid */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(selectedBadge?.id === badge.id ? null : badge)}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center text-xl
                transition-all duration-300 hover:scale-110
                ${badge.unlocked 
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                  : 'bg-navy-800/50 border border-navy-700 grayscale opacity-50'
                }
                ${selectedBadge?.id === badge.id ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-navy-900' : ''}
              `}
              aria-label={badge.name}
            >
              <span className={badge.unlocked ? '' : 'filter blur-[1px]'}>
                {badge.emoji}
              </span>
              {!badge.unlocked && badge.progress > 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Selected badge details */}
        {selectedBadge && (
          <div className={`
            p-3 rounded-lg transition-all duration-300
            ${selectedBadge.unlocked 
              ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20' 
              : 'bg-navy-800/50 border border-navy-700'
            }
          `}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedBadge.emoji}</span>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{selectedBadge.name}</h4>
                <p className="text-navy-400 text-xs">{selectedBadge.description}</p>
              </div>
              {selectedBadge.unlocked ? (
                <span className="text-xs text-green-400 font-medium">✓ Unlocked</span>
              ) : (
                <span className="text-xs text-navy-500">
                  {selectedBadge.progress}/{selectedBadge.maxProgress}
                </span>
              )}
            </div>
          </div>
        )}
        
        {!selectedBadge && (
          <p className="text-navy-500 text-xs text-center">
            Tap a badge to see details
          </p>
        )}
      </div>
    </div>
  )
}