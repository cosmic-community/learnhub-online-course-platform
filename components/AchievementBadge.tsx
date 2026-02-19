'use client'

import { useState } from 'react'

interface AchievementBadgeProps {
  icon: string
  title: string
  description: string
  unlocked?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

const rarityColors = {
  common: 'from-slate-400 to-slate-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500',
}

const rarityGlow = {
  common: 'shadow-slate-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-amber-500/50',
}

export default function AchievementBadge({
  icon,
  title,
  description,
  unlocked = true,
  rarity = 'common',
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-16 h-16 rounded-xl flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${unlocked 
            ? `bg-gradient-to-br ${rarityColors[rarity]} shadow-lg ${rarityGlow[rarity]}` 
            : 'bg-navy-800 grayscale opacity-50'
          }
          ${isHovered && unlocked ? 'scale-110 rotate-3' : ''}
        `}
      >
        <span className={`text-2xl ${unlocked ? '' : 'opacity-30'}`}>{icon}</span>
        
        {/* Shine effect for unlocked badges */}
        {unlocked && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div 
              className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000
              `}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
          bg-navy-800 border border-navy-700 rounded-lg shadow-xl
          whitespace-nowrap z-50 pointer-events-none
          transition-all duration-200
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-navy-400">{description}</div>
        {unlocked && (
          <div className={`text-xs mt-1 font-medium bg-gradient-to-r ${rarityColors[rarity]} bg-clip-text text-transparent capitalize`}>
            {rarity}
          </div>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
      </div>
    </div>
  )
}