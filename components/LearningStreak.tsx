'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const milestones = [
  { days: 3, emoji: '🌱', label: 'Seedling' },
  { days: 7, emoji: '🌿', label: 'Growing' },
  { days: 14, emoji: '🌳', label: 'Thriving' },
  { days: 30, emoji: '🏆', label: 'Champion' },
  { days: 60, emoji: '💎', label: 'Diamond' },
  { days: 100, emoji: '🔥', label: 'Legendary' },
]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday, increment streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        
        // Check for milestone celebration
        const newMilestone = milestones.find(m => m.days === newStreak.currentStreak)
        if (newMilestone) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken, reset
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
      }
    } else {
      // First visit ever
      const newStreak: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
    }
  }, [])

  if (!streak) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-800 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-navy-800 rounded"></div>
      </div>
    )
  }

  const currentMilestone = [...milestones].reverse().find(m => streak.currentStreak >= m.days)
  const nextMilestone = milestones.find(m => m.days > streak.currentStreak)
  const progress = nextMilestone 
    ? ((streak.currentStreak - (currentMilestone?.days || 0)) / (nextMilestone.days - (currentMilestone?.days || 0))) * 100
    : 100

  return (
    <div className="card p-6 relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-900/90 z-10 animate-fadeIn">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">{currentMilestone?.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Milestone Reached!</h3>
            <p className="text-primary-400">{currentMilestone?.label} - {currentMilestone?.days} Day Streak!</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{currentMilestone?.emoji || '🌱'}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
          <p className="text-sm text-navy-400">Keep the momentum going!</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-400">{streak.currentStreak}</div>
          <div className="text-xs text-navy-400 uppercase tracking-wide">Day Streak</div>
        </div>
        <div className="h-16 w-px bg-navy-700"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streak.longestStreak}</div>
          <div className="text-xs text-navy-400 uppercase tracking-wide">Best Streak</div>
        </div>
        <div className="h-16 w-px bg-navy-700"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{streak.totalVisits}</div>
          <div className="text-xs text-navy-400 uppercase tracking-wide">Total Visits</div>
        </div>
      </div>

      {nextMilestone && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-navy-400">Next: {nextMilestone.emoji} {nextMilestone.label}</span>
            <span className="text-primary-400">{nextMilestone.days - streak.currentStreak} days to go</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!nextMilestone && (
        <div className="text-center py-2">
          <span className="text-primary-400 font-semibold">🔥 Legendary Status Achieved!</span>
        </div>
      )}
    </div>
  )
}