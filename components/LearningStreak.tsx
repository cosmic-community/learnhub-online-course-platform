'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface StreakData {
  currentStreak: number
  lastVisit: string
  longestStreak: number
  totalVisits: number
}

const MILESTONES = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const checkAndUpdateStreak = useCallback(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today, no changes needed
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = data.currentStreak + 1
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          longestStreak: Math.max(data.longestStreak, newStreak),
          totalVisits: data.totalVisits + 1
        }
        
        // Check for milestone
        if (MILESTONES.includes(newStreak)) {
          setMilestoneReached(newStreak)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setMilestoneReached(null)
          }, 5000)
        }
        
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)
      } else {
        // Streak broken, reset to 1
        data = {
          currentStreak: 1,
          lastVisit: today,
          longestStreak: data.longestStreak,
          totalVisits: data.totalVisits + 1
        }
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: today,
        longestStreak: 1,
        totalVisits: 1
      }
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
    
    localStorage.setItem('learning-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  useEffect(() => {
    checkAndUpdateStreak()
  }, [checkAndUpdateStreak])

  if (!streakData) {
    return (
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700">
          <span className="text-xl">🔥</span>
          <span className="text-navy-400 text-sm">Loading streak...</span>
        </div>
      </div>
    )
  }

  const getStreakMessage = (streak: number): string => {
    if (streak === 1) return "Great start! Come back tomorrow to keep it going!"
    if (streak < 3) return "You're building momentum!"
    if (streak < 7) return "Impressive consistency!"
    if (streak < 14) return "You're on fire! 🔥"
    if (streak < 30) return "Incredible dedication!"
    if (streak < 50) return "You're a learning machine!"
    return "Legendary learner! 🏆"
  }

  const getNextMilestone = (streak: number): number | null => {
    return MILESTONES.find(m => m > streak) || null
  }

  const nextMilestone = getNextMilestone(streakData.currentStreak)

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="mb-8 flex flex-col items-center gap-3">
        {/* Main Streak Display */}
        <div 
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 transition-all cursor-default ${
            isAnimating ? 'animate-streak-pop scale-110' : ''
          }`}
        >
          <span className={`text-2xl ${isAnimating ? 'animate-bounce' : 'animate-flame'}`}>
            🔥
          </span>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">
              {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''} Streak!
            </span>
            <span className="text-orange-300/80 text-xs leading-tight">
              {getStreakMessage(streakData.currentStreak)}
            </span>
          </div>
        </div>

        {/* Milestone Progress */}
        {nextMilestone && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-navy-400">Next milestone:</span>
            <div className="flex items-center gap-1">
              <span className="text-primary-400 font-semibold">{nextMilestone} days</span>
              <div className="w-24 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                  style={{ width: `${(streakData.currentStreak / nextMilestone) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Milestone Celebration */}
        {milestoneReached && (
          <div className="animate-bounce-in bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg px-4 py-2">
            <span className="text-yellow-400 font-bold">
              🎉 Milestone Reached: {milestoneReached} Days! 🎉
            </span>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-navy-500">
          <span>Best: {streakData.longestStreak} days</span>
          <span className="w-1 h-1 bg-navy-600 rounded-full" />
          <span>Total visits: {streakData.totalVisits}</span>
        </div>
      </div>
    </>
  )
}