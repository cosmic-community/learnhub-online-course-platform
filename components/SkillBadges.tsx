'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/types'

interface SkillBadgesProps {
  categories: Category[]
}

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  earnedDate?: string
  color: string
}

const BADGE_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-yellow-500',
  'from-red-500 to-rose-500',
]

export default function SkillBadges({ categories }: SkillBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null)

  useEffect(() => {
    // Create badges from categories
    const savedBadges = localStorage.getItem('learnhub-badges')
    const earnedBadges: Record<string, string> = savedBadges ? JSON.parse(savedBadges) : {}
    
    const categoryBadges: Badge[] = categories.map((cat, index) => ({
      id: cat.id,
      name: cat.metadata?.name || cat.title,
      icon: cat.metadata?.icon || '🏆',
      description: `Master of ${cat.metadata?.name || cat.title}`,
      earned: !!earnedBadges[cat.id],
      earnedDate: earnedBadges[cat.id],
      color: BADGE_COLORS[index % BADGE_COLORS.length],
    }))
    
    // Add special achievement badges
    const specialBadges: Badge[] = [
      {
        id: 'first-lesson',
        name: 'First Steps',
        icon: '🚀',
        description: 'Complete your first lesson',
        earned: !!earnedBadges['first-lesson'],
        earnedDate: earnedBadges['first-lesson'],
        color: 'from-indigo-500 to-violet-500',
      },
      {
        id: 'week-streak',
        name: 'Week Warrior',
        icon: '⚔️',
        description: 'Maintain a 7-day learning streak',
        earned: !!earnedBadges['week-streak'],
        earnedDate: earnedBadges['week-streak'],
        color: 'from-amber-500 to-orange-500',
      },
      {
        id: 'night-owl',
        name: 'Night Owl',
        icon: '🦉',
        description: 'Learn after midnight',
        earned: !!earnedBadges['night-owl'],
        earnedDate: earnedBadges['night-owl'],
        color: 'from-slate-500 to-zinc-500',
      },
    ]
    
    setBadges([...specialBadges, ...categoryBadges])
    
    // Auto-earn Night Owl badge if it's after midnight
    const hour = new Date().getHours()
    if (hour >= 0 && hour < 5 && !earnedBadges['night-owl']) {
      setTimeout(() => {
        unlockBadge('night-owl')
      }, 2000)
    }
    
    // Auto-earn First Steps badge on first visit
    const hasVisited = localStorage.getItem('learnhub-has-visited')
    if (!hasVisited) {
      localStorage.setItem('learnhub-has-visited', 'true')
      setTimeout(() => {
        unlockBadge('first-lesson')
      }, 3000)
    }
  }, [categories])

  const unlockBadge = (badgeId: string) => {
    const savedBadges = localStorage.getItem('learnhub-badges')
    const earnedBadges: Record<string, string> = savedBadges ? JSON.parse(savedBadges) : {}
    
    if (!earnedBadges[badgeId]) {
      earnedBadges[badgeId] = new Date().toISOString()
      localStorage.setItem('learnhub-badges', JSON.stringify(earnedBadges))
      
      setShowUnlockAnimation(badgeId)
      setTimeout(() => setShowUnlockAnimation(null), 2000)
      
      setBadges(prev => prev.map(b => 
        b.id === badgeId 
          ? { ...b, earned: true, earnedDate: earnedBadges[badgeId] }
          : b
      ))
    }
  }

  const earnedCount = badges.filter(b => b.earned).length

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Skill Badges</h3>
          <p className="text-sm text-navy-400">Collect them all!</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary-500/20 rounded-full">
          <span className="text-primary-400 font-bold">{earnedCount}</span>
          <span className="text-navy-400">/</span>
          <span className="text-navy-400">{badges.length}</span>
        </div>
      </div>
      
      {/* Badge Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {badges.map((badge) => (
          <button
            key={badge.id}
            onClick={() => setSelectedBadge(badge)}
            className={`relative aspect-square rounded-xl transition-all duration-300 ${
              badge.earned
                ? `bg-gradient-to-br ${badge.color} shadow-lg hover:scale-110 hover:shadow-xl`
                : 'bg-navy-800/50 hover:bg-navy-700/50'
            } ${showUnlockAnimation === badge.id ? 'animate-badge-unlock' : ''}`}
          >
            <div className={`absolute inset-0 flex items-center justify-center text-2xl ${
              badge.earned ? '' : 'grayscale opacity-30'
            }`}>
              {badge.icon}
            </div>
            
            {/* Locked overlay */}
            {!badge.earned && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-navy-500 text-lg">🔒</span>
              </div>
            )}
            
            {/* Shine effect for earned badges */}
            {badge.earned && (
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
              </div>
            )}
            
            {/* New badge indicator */}
            {showUnlockAnimation === badge.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
            )}
          </button>
        ))}
      </div>
      
      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-navy-900 rounded-2xl p-6 max-w-sm w-full border border-navy-700 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl mb-4 ${
              selectedBadge.earned
                ? `bg-gradient-to-br ${selectedBadge.color}`
                : 'bg-navy-800'
            }`}>
              {selectedBadge.earned ? selectedBadge.icon : '🔒'}
            </div>
            
            <h4 className="text-xl font-bold text-white text-center mb-2">
              {selectedBadge.name}
            </h4>
            
            <p className="text-navy-400 text-center mb-4">
              {selectedBadge.description}
            </p>
            
            {selectedBadge.earned && selectedBadge.earnedDate && (
              <p className="text-sm text-green-400 text-center mb-4">
                ✅ Earned on {new Date(selectedBadge.earnedDate).toLocaleDateString()}
              </p>
            )}
            
            {!selectedBadge.earned && (
              <p className="text-sm text-navy-500 text-center italic">
                Keep learning to unlock this badge!
              </p>
            )}
            
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full mt-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}