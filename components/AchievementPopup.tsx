'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const achievements: Achievement[] = [
  {
    id: 'first_visit',
    title: 'Explorer',
    description: 'Welcome to LearnHub! Your learning journey begins.',
    icon: '🌟',
    rarity: 'common'
  },
  {
    id: 'browse_courses',
    title: 'Course Scout',
    description: 'Browsed the course catalog. So many possibilities!',
    icon: '🔍',
    rarity: 'common'
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Learning after midnight. Dedication level: Expert!',
    icon: '🦉',
    rarity: 'rare'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Learning before 7 AM. The early coder catches the bug!',
    icon: '🐦',
    rarity: 'rare'
  }
]

export default function AchievementPopup() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const shown = localStorage.getItem('achievements-shown') || '[]'
    const shownIds = JSON.parse(shown) as string[]
    
    // Check for first visit
    if (!shownIds.includes('first_visit')) {
      setTimeout(() => {
        setCurrentAchievement(achievements.find(a => a.id === 'first_visit') || null)
        setIsVisible(true)
        localStorage.setItem('achievements-shown', JSON.stringify([...shownIds, 'first_visit']))
      }, 3000)
    }

    // Check for time-based achievements
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5 && !shownIds.includes('night_owl')) {
      setTimeout(() => {
        setCurrentAchievement(achievements.find(a => a.id === 'night_owl') || null)
        setIsVisible(true)
        localStorage.setItem('achievements-shown', JSON.stringify([...shownIds, 'night_owl']))
      }, 5000)
    } else if (hour >= 5 && hour < 7 && !shownIds.includes('early_bird')) {
      setTimeout(() => {
        setCurrentAchievement(achievements.find(a => a.id === 'early_bird') || null)
        setIsVisible(true)
        localStorage.setItem('achievements-shown', JSON.stringify([...shownIds, 'early_bird']))
      }, 5000)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => setCurrentAchievement(null), 500)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-green-500 to-emerald-500'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'epic': return 'bg-purple-500/10 border-purple-500/30'
      case 'rare': return 'bg-blue-500/10 border-blue-500/30'
      default: return 'bg-green-500/10 border-green-500/30'
    }
  }

  if (!currentAchievement) return null

  return (
    <div 
      className={`fixed top-24 right-5 z-50 transition-all duration-500 transform ${
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`w-80 rounded-2xl border backdrop-blur-sm shadow-2xl overflow-hidden ${getRarityBg(currentAchievement.rarity)}`}>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Header */}
        <div className={`relative p-4 bg-gradient-to-r ${getRarityColor(currentAchievement.rarity)} bg-opacity-20`}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center text-3xl animate-bounce-slow">
              {currentAchievement.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">
                Achievement Unlocked!
              </div>
              <h4 className="text-lg font-bold text-white">{currentAchievement.title}</h4>
            </div>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-navy-900/80">
          <p className="text-navy-300 text-sm">{currentAchievement.description}</p>
          
          {/* Rarity Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(currentAchievement.rarity)} text-white capitalize`}>
              {currentAchievement.rarity}
            </span>
            <span className="text-xs text-navy-500">+10 XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}