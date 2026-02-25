'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface SkillBadgesProps {
  categories: Category[]
}

interface BadgeData {
  id: string
  name: string
  icon: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  progress: number
  unlocked: boolean
}

const levelColors = {
  bronze: {
    bg: 'bg-amber-700/20',
    border: 'border-amber-600/40',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  silver: {
    bg: 'bg-gray-400/20',
    border: 'border-gray-400/40',
    text: 'text-gray-300',
    glow: 'shadow-gray-400/20',
  },
  gold: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/30',
  },
  platinum: {
    bg: 'bg-cyan-400/20',
    border: 'border-cyan-400/40',
    text: 'text-cyan-300',
    glow: 'shadow-cyan-400/30',
  },
}

export default function SkillBadges({ categories }: SkillBadgesProps) {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null)

  useEffect(() => {
    // Generate badges from categories with simulated progress
    const generatedBadges: BadgeData[] = categories.map((category, index) => {
      // Simulate different progress levels
      const progressValues = [85, 60, 45, 30, 15, 5, 0]
      const progress = progressValues[index % progressValues.length] ?? 0
      
      let level: BadgeData['level'] = 'bronze'
      if (progress >= 75) level = 'platinum'
      else if (progress >= 50) level = 'gold'
      else if (progress >= 25) level = 'silver'
      
      return {
        id: category.id,
        name: category.metadata?.name || category.title,
        icon: category.metadata?.icon || '📚',
        level,
        progress,
        unlocked: progress > 0,
      }
    })
    
    setBadges(generatedBadges)
  }, [categories])

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">🏅</span>
            Skill Badges
          </h2>
          <p className="text-navy-400">Track your mastery across different skills</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {badges.map((badge, index) => {
            const colors = levelColors[badge.level]
            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`
                  relative group animate-scale-in
                  ${badge.unlocked ? 'cursor-pointer' : 'cursor-default opacity-50'}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Badge container */}
                <div
                  className={`
                    w-20 h-20 md:w-24 md:h-24 rounded-full 
                    ${colors.bg} ${colors.border} border-2
                    flex items-center justify-center
                    transition-all duration-300
                    ${badge.unlocked ? `hover:scale-110 hover:shadow-lg ${colors.glow}` : ''}
                  `}
                >
                  {/* Progress ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-navy-700"
                    />
                    {badge.unlocked && (
                      <circle
                        cx="50%"
                        cy="50%"
                        r="46%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 46}`}
                        strokeDashoffset={`${2 * Math.PI * 46 * (1 - badge.progress / 100)}`}
                        className={colors.text}
                      />
                    )}
                  </svg>
                  
                  {/* Icon */}
                  <span className="text-2xl md:text-3xl relative z-10">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </span>
                </div>

                {/* Badge name */}
                <p className={`mt-2 text-xs md:text-sm font-medium ${colors.text} text-center max-w-[80px] md:max-w-[96px] truncate`}>
                  {badge.name}
                </p>

                {/* Level indicator */}
                {badge.unlocked && (
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                    <span className="text-xs">
                      {badge.level === 'platinum' ? '💎' : badge.level === 'gold' ? '⭐' : badge.level === 'silver' ? '🥈' : '🥉'}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Badge detail modal */}
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="card p-6 max-w-sm w-full animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const colors = levelColors[selectedBadge.level]
                return (
                  <>
                    <div className="text-center mb-4">
                      <div className={`inline-flex w-24 h-24 rounded-full ${colors.bg} ${colors.border} border-2 items-center justify-center mb-4`}>
                        <span className="text-5xl">{selectedBadge.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{selectedBadge.name}</h3>
                      <p className={`text-sm ${colors.text} capitalize`}>
                        {selectedBadge.level} Level
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-navy-400">Progress</span>
                        <span className={colors.text}>{selectedBadge.progress}%</span>
                      </div>
                      <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.text.replace('text-', 'bg-')} transition-all duration-500`}
                          style={{ width: `${selectedBadge.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-navy-400 text-sm text-center mb-4">
                      {selectedBadge.progress < 25 && 'Just getting started! Complete more lessons to level up.'}
                      {selectedBadge.progress >= 25 && selectedBadge.progress < 50 && 'Great progress! Keep going to reach the next level.'}
                      {selectedBadge.progress >= 50 && selectedBadge.progress < 75 && 'Amazing work! You\'re becoming an expert.'}
                      {selectedBadge.progress >= 75 && 'Incredible mastery! You\'re a true expert.'}
                    </p>

                    <button
                      onClick={() => setSelectedBadge(null)}
                      className="btn-secondary w-full"
                    >
                      Close
                    </button>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}