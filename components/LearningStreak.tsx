'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function LearningStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (savedStreak) {
      const data: StreakData = JSON.parse(savedStreak)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(data)
      } else if (lastVisitDate === yesterdayStr) {
        // Visited yesterday - continue streak!
        const newStreak: StreakData = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalVisits: data.totalVisits + 1
        }
        localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
        setStreak(newStreak)
        
        // Trigger celebration for milestone streaks
        if (newStreak.currentStreak % 5 === 0 || newStreak.currentStreak === 1) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      } else {
        // Streak broken - start fresh
        const newStreak: StreakData = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1
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
        totalVisits: 1
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(newStreak))
      setStreak(newStreak)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [])

  if (!mounted || !streak) {
    return (
      <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-6 border border-navy-700 animate-pulse">
        <div className="h-20 bg-navy-700 rounded" />
      </div>
    )
  }

  const getStreakEmoji = (count: number) => {
    if (count >= 30) return '🏆'
    if (count >= 14) return '💎'
    if (count >= 7) return '🔥'
    if (count >= 3) return '⚡'
    return '✨'
  }

  const getMotivationalMessage = (count: number) => {
    if (count >= 30) return "You're a learning legend! 🎉"
    if (count >= 14) return "Two weeks strong! Amazing dedication!"
    if (count >= 7) return "A full week! You're on fire!"
    if (count >= 3) return "Great momentum! Keep it up!"
    if (count === 1) return "Welcome back! Let's learn something new!"
    return "Your learning journey begins!"
  }

  return (
    <div className="relative">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-navy-800/50 to-navy-900/50 backdrop-blur-sm rounded-2xl p-6 border border-navy-700 hover:border-primary-500/30 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-5xl animate-bounce-slow">
                {getStreakEmoji(streak.currentStreak)}
              </div>
              {streak.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="text-3xl font-bold text-white">
                {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
              </div>
              <div className="text-navy-400 text-sm">Current streak</div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center sm:text-left">
            <p className="text-primary-400 font-medium">
              {getMotivationalMessage(streak.currentStreak)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streak.longestStreak}</div>
              <div className="text-navy-500 text-xs">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{streak.totalVisits}</div>
              <div className="text-navy-500 text-xs">Total Visits</div>
            </div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {streak.currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-navy-500 mb-1">
              <span>Progress to next milestone</span>
              <span>
                {streak.currentStreak < 3 ? '3 days' : 
                 streak.currentStreak < 7 ? '7 days' :
                 streak.currentStreak < 14 ? '14 days' : '30 days'}
              </span>
            </div>
            <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ 
                  width: `${
                    streak.currentStreak < 3 ? (streak.currentStreak / 3) * 100 :
                    streak.currentStreak < 7 ? (streak.currentStreak / 7) * 100 :
                    streak.currentStreak < 14 ? (streak.currentStreak / 14) * 100 :
                    (streak.currentStreak / 30) * 100
                  }%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}