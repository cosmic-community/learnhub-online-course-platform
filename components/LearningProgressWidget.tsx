'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  lessonsCompleted: number
  currentStreak: number
  totalMinutes: number
  lastVisit: string
}

const defaultStats: LearningStats = {
  lessonsCompleted: 0,
  currentStreak: 1,
  totalMinutes: 0,
  lastVisit: new Date().toISOString(),
}

export default function LearningProgressWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<LearningStats>(defaultStats)
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    if (savedStats) {
      const parsed = JSON.parse(savedStats) as LearningStats
      
      // Check if it's a new day for streak
      const lastVisit = new Date(parsed.lastVisit)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Continue streak!
        parsed.currentStreak += 1
        setShowStreakAnimation(true)
        setTimeout(() => setShowStreakAnimation(false), 3000)
      } else if (diffDays > 1) {
        // Streak broken
        parsed.currentStreak = 1
      }
      
      parsed.lastVisit = today.toISOString()
      setStats(parsed)
      localStorage.setItem('learnhub-stats', JSON.stringify(parsed))
    } else {
      localStorage.setItem('learnhub-stats', JSON.stringify(defaultStats))
    }

    // Show widget after a delay for smooth entrance
    setTimeout(() => setIsVisible(true), 1000)
  }, [])

  // Simulate adding learning time (in a real app, this would track actual time)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const updated = { ...prev, totalMinutes: prev.totalMinutes + 1 }
        localStorage.setItem('learnhub-stats', JSON.stringify(updated))
        return updated
      })
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '👑'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getMotivationalMessage = (): string => {
    const messages = [
      "Keep learning! You're doing great! 🚀",
      "Every lesson makes you better! 💪",
      "Consistency is key! Keep it up! 🔑",
      "You're building something amazing! 🏗️",
      "Knowledge is power! ⚡",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  if (!isVisible) return null

  return (
    <>
      {/* Streak Animation Overlay */}
      {showStreakAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce-in text-center">
            <div className="text-8xl mb-4">🔥</div>
            <div className="text-3xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 rounded-2xl shadow-2xl">
              {stats.currentStreak} Day Streak!
            </div>
          </div>
        </div>
      )}

      {/* Floating Widget Button */}
      <div className="fixed bottom-24 right-6 z-40">
        {/* Expanded Panel */}
        <div 
          className={`absolute bottom-16 right-0 w-80 transition-all duration-500 ease-out transform ${
            isOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="bg-navy-900/95 backdrop-blur-xl border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Your Learning Journey
              </h3>
              <p className="text-primary-100 text-sm mt-1">{getMotivationalMessage()}</p>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {/* Streak */}
              <div className="bg-navy-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl mb-1">{getStreakEmoji(stats.currentStreak)}</div>
                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>

              {/* Lessons */}
              <div className="bg-navy-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>

              {/* Time */}
              <div className="bg-navy-800/50 rounded-xl p-4 text-center col-span-2 transform hover:scale-105 transition-transform">
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.totalMinutes)}</div>
                <div className="text-xs text-navy-400">Total Learning Time</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-4">
              <div className="flex justify-between text-xs text-navy-400 mb-2">
                <span>Weekly Goal</span>
                <span>{Math.min(stats.lessonsCompleted, 5)}/5 lessons</span>
              </div>
              <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((stats.lessonsCompleted / 5) * 100, 100)}%` }}
                />
              </div>
              {stats.lessonsCompleted >= 5 && (
                <div className="text-center text-green-400 text-xs mt-2 animate-pulse">
                  🎉 Weekly goal achieved!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 flex items-center justify-center transform transition-all duration-300 hover:scale-110 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-label="Toggle learning progress"
        >
          <span className="text-2xl">{isOpen ? '✕' : '📈'}</span>
        </button>

        {/* Notification Badge */}
        {stats.currentStreak >= 3 && !isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs animate-pulse">
            🔥
          </div>
        )}
      </div>
    </>
  )
}