'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface ToastContextType {
  showAchievement: (achievement: Achievement) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useAchievementToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useAchievementToast must be used within AchievementToastProvider')
  }
  return context
}

export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<(Achievement & { timestamp: number })[]>([])

  const showAchievement = useCallback((achievement: Achievement) => {
    const toast = { ...achievement, timestamp: Date.now() }
    setToasts(prev => [...prev, toast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.timestamp !== toast.timestamp))
    }, 5000)
  }, [])

  const removeToast = useCallback((timestamp: number) => {
    setToasts(prev => prev.filter(t => t.timestamp !== timestamp))
  }, [])

  return (
    <ToastContext.Provider value={{ showAchievement }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <AchievementToastItem
            key={toast.timestamp}
            achievement={toast}
            onClose={() => removeToast(toast.timestamp)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function AchievementToastItem({ 
  achievement, 
  onClose 
}: { 
  achievement: Achievement & { timestamp: number }
  onClose: () => void
}) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const rarityColors = {
    common: 'from-navy-700 to-navy-800 border-navy-600',
    rare: 'from-blue-900/50 to-blue-950/50 border-blue-500/50',
    epic: 'from-purple-900/50 to-purple-950/50 border-purple-500/50',
    legendary: 'from-yellow-900/30 to-orange-950/30 border-yellow-500/50',
  }

  const rarityGlow = {
    common: '',
    rare: 'shadow-blue-500/20',
    epic: 'shadow-purple-500/30',
    legendary: 'shadow-yellow-500/40 pulse-glow',
  }

  const rarityLabel = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  }

  const rarityLabelColor = {
    common: 'text-navy-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-yellow-400',
  }

  return (
    <div
      className={`
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        bg-gradient-to-r ${rarityColors[achievement.rarity]}
        border rounded-xl p-4 shadow-lg ${rarityGlow[achievement.rarity]}
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-3">
        {/* Achievement Icon */}
        <div className="flex-shrink-0 text-3xl">
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wider ${rarityLabelColor[achievement.rarity]}`}>
              {rarityLabel[achievement.rarity]}
            </span>
            <span className="text-xs text-navy-500">Achievement</span>
          </div>
          <h4 className="font-bold text-white text-sm truncate">
            {achievement.title}
          </h4>
          <p className="text-xs text-navy-300 mt-0.5">
            {achievement.description}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-navy-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      <div className="mt-3 h-0.5 bg-navy-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 rounded-full"
          style={{
            animation: 'shrink 5s linear forwards',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Pre-defined achievements
export const ACHIEVEMENTS = {
  FIRST_LESSON: {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Completed your first lesson!',
    icon: '🎯',
    rarity: 'common' as const,
  },
  COURSE_COMPLETE: {
    id: 'course-complete',
    title: 'Knowledge Seeker',
    description: 'Completed an entire course!',
    icon: '🎓',
    rarity: 'rare' as const,
  },
  STREAK_7: {
    id: 'streak-7',
    title: 'Week Warrior',
    description: '7 day learning streak!',
    icon: '🔥',
    rarity: 'rare' as const,
  },
  STREAK_30: {
    id: 'streak-30',
    title: 'Monthly Master',
    description: '30 day learning streak!',
    icon: '⭐',
    rarity: 'epic' as const,
  },
  STREAK_100: {
    id: 'streak-100',
    title: 'Centurion',
    description: '100 day learning streak!',
    icon: '👑',
    rarity: 'legendary' as const,
  },
  NIGHT_OWL: {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Learned after midnight!',
    icon: '🦉',
    rarity: 'common' as const,
  },
  EARLY_BIRD: {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Learned before 6 AM!',
    icon: '🐦',
    rarity: 'common' as const,
  },
  SPEED_DEMON: {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Completed 5 lessons in one day!',
    icon: '⚡',
    rarity: 'epic' as const,
  },
}