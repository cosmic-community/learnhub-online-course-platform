'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const updateStreak = () => {
      const today = new Date().toDateString()
      const stored = localStorage.getItem('learnhub-streak')
      
      let streakData: StreakData = stored 
        ? JSON.parse(stored) 
        : { currentStreak: 0, lastVisit: '', totalVisits: 0, longestStreak: 0 }

      const lastVisitDate = streakData.lastVisit ? new Date(streakData.lastVisit) : null
      const todayDate = new Date(today)
      
      if (streakData.lastVisit !== today) {
        streakData.totalVisits++
        
        if (lastVisitDate) {
          const diffTime = todayDate.getTime() - lastVisitDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            // Consecutive day - increase streak
            streakData.currentStreak++
            
            // Check for milestone
            if (MILESTONES.includes(streakData.currentStreak)) {
              setIsNewMilestone(true)
              setShowCelebration(true)
              setTimeout(() => setShowCelebration(false), 3000)
            }
          } else if (diffDays > 1) {
            // Streak broken
            streakData.currentStreak = 1
          }
        } else {
          // First visit
          streakData.currentStreak = 1
        }
        
        // Update longest streak
        if (streakData.currentStreak > streakData.longestStreak) {
          streakData.longestStreak = streakData.currentStreak
        }
        
        streakData.lastVisit = today
        localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
      }
      
      setStreak(streakData)
    }

    updateStreak()
  }, [])

  if (!streak) return null

  const getStreakEmoji = (days: number): string => {
    if (days >= 100) return '🏆'
    if (days >= 50) return '💎'
    if (days >= 30) return '🌟'
    if (days >= 14) return '⭐'
    if (days >= 7) return '🔥'
    if (days >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (days: number): string => {
    if (days >= 100) return 'Legendary learner!'
    if (days >= 50) return 'Diamond dedication!'
    if (days >= 30) return 'Monthly master!'
    if (days >= 14) return 'Two-week warrior!'
    if (days >= 7) return 'Week-long wonder!'
    if (days >= 3) return 'Building momentum!'
    if (days >= 1) return 'Keep it going!'
    return 'Start your streak!'
  }

  return (
    <>
      {/* Confetti Celebration */}
      {showCelebration && <Confetti />}
      
      {/* Streak Display */}
      <div className={`card p-4 ${streak.currentStreak >= 7 ? 'streak-glow' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`text-4xl ${streak.currentStreak >= 3 ? 'streak-fire float-animation' : ''}`}>
            {getStreakEmoji(streak.currentStreak)}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white number-animate">
                {streak.currentStreak}
              </span>
              <span className="text-navy-400 text-sm">day streak</span>
            </div>
            <p className="text-sm text-primary-400 font-medium">
              {getStreakMessage(streak.currentStreak)}
            </p>
          </div>
          {streak.currentStreak >= 3 && (
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs text-navy-500">Best: {streak.longestStreak} days</span>
              <span className="text-xs text-navy-500">{streak.totalVisits} visits</span>
            </div>
          )}
        </div>
        
        {/* Milestone Progress */}
        {streak.currentStreak > 0 && (
          <div className="mt-3 pt-3 border-t border-navy-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-navy-500">Next milestone</span>
              <span className="text-xs text-primary-400">
                {getNextMilestone(streak.currentStreak)} days
              </span>
            </div>
            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${getMilestoneProgress(streak.currentStreak)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* New Milestone Toast */}
      {isNewMilestone && showCelebration && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 slide-up">
          <div className="bg-gradient-to-r from-orange-500 to-primary-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span>{streak.currentStreak} Day Streak!</span>
            <span className="text-xl">🎉</span>
          </div>
        </div>
      )}
    </>
  )
}

function getNextMilestone(current: number): number {
  for (const milestone of MILESTONES) {
    if (milestone > current) return milestone
  }
  return current + 50 // After 100, every 50 days
}

function getMilestoneProgress(current: number): number {
  let prevMilestone = 0
  for (const milestone of MILESTONES) {
    if (milestone > current) {
      const range = milestone - prevMilestone
      const progress = current - prevMilestone
      return (progress / range) * 100
    }
    prevMilestone = milestone
  }
  return 100
}

function Confetti() {
  const colors = ['#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}