'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  longestStreak: number
}

const milestones = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isNewMilestone, setIsNewMilestone] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learning-streak')
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored) as StreakData
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterday) {
        // Visited yesterday - streak continues!
        const newStreak = data.currentStreak + 1
        const newLongest = Math.max(newStreak, data.longestStreak)
        
        // Check for milestone
        if (milestones.includes(newStreak)) {
          setIsNewMilestone(true)
          setShowCelebration(true)
        }
        
        data = {
          currentStreak: newStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: newLongest
        }
        localStorage.setItem('learning-streak', JSON.stringify(data))
        setStreak(data)
      } else {
        // Streak broken - start fresh
        data = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          longestStreak: data.longestStreak
        }
        localStorage.setItem('learning-streak', JSON.stringify(data))
        setStreak(data)
      }
    } else {
      // First visit ever!
      data = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        longestStreak: 1
      }
      localStorage.setItem('learning-streak', JSON.stringify(data))
      setStreak(data)
      setShowCelebration(true)
    }
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streak) return null

  const nextMilestone = milestones.find(m => m > streak.currentStreak) || milestones[milestones.length - 1]
  const progress = (streak.currentStreak / nextMilestone) * 100

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showCelebration && (
        <div className="absolute -inset-4 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="card p-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl animate-pulse-slow">
                🔥
              </div>
              <div>
                <div className="text-sm text-navy-400">Learning Streak</div>
                <div className="text-2xl font-bold text-white">
                  {streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
            
            {isNewMilestone && (
              <div className="badge bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 animate-bounce">
                🎉 New Milestone!
              </div>
            )}
          </div>

          {/* Progress to next milestone */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-navy-400 mb-1">
              <span>Progress to {nextMilestone}-day streak</span>
              <span>{streak.currentStreak}/{nextMilestone}</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-navy-800">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{streak.totalVisits}</div>
              <div className="text-xs text-navy-400">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{streak.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}