'use client'

import { useState, useEffect, useCallback } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  coursesViewed: string[]
}

const STREAK_STORAGE_KEY = 'learnhub-streak-data'
const MILESTONE_STREAKS = [3, 7, 14, 30, 50, 100]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const createConfetti = useCallback(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
    const confettiCount = 50
    const container = document.createElement('div')
    container.className = 'fixed inset-0 pointer-events-none z-[100] overflow-hidden'
    document.body.appendChild(container)

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const animDuration = 2 + Math.random() * 2
      const size = 8 + Math.random() * 8

      confetti.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti-fall ${animDuration}s ease-out forwards;
        transform: rotate(${Math.random() * 360}deg);
      `
      container.appendChild(confetti)
    }

    setTimeout(() => container.remove(), 4000)
  }, [])

  useEffect(() => {
    // Add confetti animation styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes streak-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes flame-flicker {
        0%, 100% { transform: scale(1) rotate(-2deg); }
        50% { transform: scale(1.1) rotate(2deg); }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    const loadAndUpdateStreak = () => {
      const stored = localStorage.getItem(STREAK_STORAGE_KEY)
      const today = new Date().toDateString()
      
      let data: StreakData = stored ? JSON.parse(stored) : {
        currentStreak: 0,
        longestStreak: 0,
        lastVisitDate: '',
        totalVisits: 0,
        coursesViewed: []
      }

      const lastVisit = data.lastVisitDate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastVisit !== today) {
        data.totalVisits += 1
        
        if (lastVisit === yesterdayString) {
          // Continuing streak
          data.currentStreak += 1
        } else if (lastVisit !== today) {
          // Streak broken or first visit
          data.currentStreak = 1
        }
        
        data.lastVisitDate = today
        
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak
        }

        // Check for milestone
        if (MILESTONE_STREAKS.includes(data.currentStreak)) {
          setMilestoneReached(data.currentStreak)
          setShowCelebration(true)
          setTimeout(() => {
            createConfetti()
          }, 100)
          setTimeout(() => {
            setShowCelebration(false)
            setMilestoneReached(null)
          }, 4000)
        }

        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
      }

      setStreakData(data)
      setTimeout(() => setIsVisible(true), 500)
    }

    loadAndUpdateStreak()
  }, [createConfetti])

  if (!streakData) return null

  const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak) || MILESTONE_STREAKS[MILESTONE_STREAKS.length - 1]
  const progressToNext = (streakData.currentStreak / nextMilestone) * 100

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && milestoneReached && (
        <div className="fixed inset-0 flex items-center justify-center z-[90] bg-navy-950/80 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 rounded-3xl p-8 max-w-sm mx-4 text-center"
            style={{ animation: 'streak-pulse 0.5s ease-in-out infinite' }}
          >
            <div className="text-6xl mb-4" style={{ animation: 'flame-flicker 0.3s ease-in-out infinite' }}>
              🔥
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {milestoneReached} Day Streak! 🎉
            </h3>
            <p className="text-navy-300">
              You&apos;re on fire! Keep up the amazing learning momentum!
            </p>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div 
        className={`card p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span style={{ animation: streakData.currentStreak >= 3 ? 'flame-flicker 0.5s ease-in-out infinite' : 'none' }}>
              🔥
            </span>
            Learning Streak
          </h3>
          <div className="text-sm text-navy-400">
            Best: {streakData.longestStreak} days
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-navy-400">days</div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Progress to {nextMilestone} days</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-navy-800">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.totalVisits}</div>
            <div className="text-xs text-navy-400">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{streakData.coursesViewed.length}</div>
            <div className="text-xs text-navy-400">Courses Explored</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {streakData.currentStreak >= 7 ? '⭐' : streakData.currentStreak >= 3 ? '🌟' : '💫'}
            </div>
            <div className="text-xs text-navy-400">Status</div>
          </div>
        </div>

        {streakData.currentStreak > 0 && (
          <div className="mt-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <p className="text-sm text-primary-300 text-center">
              {streakData.currentStreak === 1 && "Great start! Come back tomorrow to build your streak! 🚀"}
              {streakData.currentStreak >= 2 && streakData.currentStreak < 7 && "You're building momentum! Keep it up! 💪"}
              {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && "Amazing consistency! You're a dedicated learner! 🌟"}
              {streakData.currentStreak >= 30 && "Incredible! You're a learning champion! 🏆"}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

// Hook to track course views
export function useTrackCourseView(courseSlug: string) {
  useEffect(() => {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      if (!data.coursesViewed.includes(courseSlug)) {
        data.coursesViewed.push(courseSlug)
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
      }
    }
  }, [courseSlug])
}