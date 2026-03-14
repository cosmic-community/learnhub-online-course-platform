'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const STREAK_MILESTONES = [
  { days: 3, emoji: '🔥', message: "You're on fire! 3 day streak!" },
  { days: 7, emoji: '⭐', message: "Amazing! 1 week streak!" },
  { days: 14, emoji: '🏆', message: "Incredible! 2 week streak!" },
  { days: 30, emoji: '💎', message: "Legendary! 1 month streak!" },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Start your learning journey today!"
  if (streak === 1) return "Great start! Come back tomorrow to build your streak!"
  if (streak < 7) return `${streak} days strong! Keep it up!`
  if (streak < 30) return `Amazing ${streak} day streak! You're unstoppable!`
  return `Incredible ${streak} day streak! You're a learning champion!`
}

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<typeof STREAK_MILESTONES[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Load streak data from localStorage
    const loadStreakData = () => {
      try {
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
            setStreakData(data)
          } else if (lastVisitDate === yesterdayStr) {
            // Visited yesterday - extend streak
            const newStreak = data.currentStreak + 1
            const updatedData: StreakData = {
              ...data,
              currentStreak: newStreak,
              lastVisit: today,
              totalVisits: data.totalVisits + 1,
            }
            
            // Check for new milestone
            const milestone = STREAK_MILESTONES.find(m => m.days === newStreak)
            if (milestone) {
              setNewMilestone(milestone)
              setShowCelebration(true)
              updatedData.achievements = [...(data.achievements || []), `${milestone.days}-day-streak`]
            }
            
            localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
            setStreakData(updatedData)
          } else {
            // Streak broken - reset
            const resetData: StreakData = {
              currentStreak: 1,
              lastVisit: today,
              totalVisits: data.totalVisits + 1,
              achievements: data.achievements || [],
            }
            localStorage.setItem('learnhub-streak', JSON.stringify(resetData))
            setStreakData(resetData)
          }
        } else {
          // First visit
          const newData: StreakData = {
            currentStreak: 1,
            lastVisit: today,
            totalVisits: 1,
            achievements: [],
          }
          localStorage.setItem('learnhub-streak', JSON.stringify(newData))
          setStreakData(newData)
          setShowCelebration(true)
        }
      } catch {
        // Handle localStorage errors gracefully
      }
    }

    loadStreakData()
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
        setNewMilestone(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  if (!streakData || !isVisible) return null

  const greeting = getGreeting()
  const message = getMotivationalMessage(streakData.currentStreak)
  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '✨' : '👋'

  return (
    <>
      {/* Celebration Confetti */}
      {showCelebration && newMilestone && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">{['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}</span>
            </div>
          ))}
          
          {/* Milestone banner */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-in">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-primary-500/30">
              <div className="text-center">
                <span className="text-4xl block mb-2">{newMilestone.emoji}</span>
                <span className="text-xl font-bold">{newMilestone.message}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-b border-primary-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-wave">{streakEmoji}</span>
              <div>
                <p className="text-white font-medium">
                  {greeting}, learner!
                </p>
                <p className="text-primary-300 text-sm">{message}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Streak Counter */}
              <div className="hidden sm:flex items-center gap-2 bg-navy-800/50 rounded-full px-4 py-2">
                <span className="text-lg">🔥</span>
                <span className="text-white font-bold">{streakData.currentStreak}</span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="text-navy-400 hover:text-white transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}