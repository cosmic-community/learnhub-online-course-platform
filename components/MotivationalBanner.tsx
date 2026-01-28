'use client'

import { useState, useEffect } from 'react'

const MOTIVATIONAL_MESSAGES = [
  { emoji: '🚀', message: "Every expert was once a beginner. Keep going!" },
  { emoji: '💡', message: "Learning is a superpower. You're getting stronger!" },
  { emoji: '🌟', message: "Small daily improvements lead to stunning results." },
  { emoji: '🎯', message: "Focus on progress, not perfection." },
  { emoji: '⚡', message: "The best time to learn was yesterday. The next best time is now!" },
  { emoji: '🔥', message: "You're on fire! Don't stop now!" },
  { emoji: '💪', message: "Consistency beats intensity. Keep showing up!" },
  { emoji: '🏆', message: "Success is the sum of small efforts repeated daily." },
  { emoji: '✨', message: "Your future self will thank you for learning today." },
  { emoji: '🌈', message: "Every lesson learned is a step toward your goals." },
]

interface MotivationalBannerProps {
  coursesCount: number
  lessonsCount: number
}

export default function MotivationalBanner({ coursesCount, lessonsCount }: MotivationalBannerProps) {
  const [currentMessage, setCurrentMessage] = useState(MOTIVATIONAL_MESSAGES[0])
  const [isVisible, setIsVisible] = useState(true)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Get random message based on time of day for variety
    const index = Math.floor(Date.now() / 60000) % MOTIVATIONAL_MESSAGES.length
    setCurrentMessage(MOTIVATIONAL_MESSAGES[index] ?? MOTIVATIONAL_MESSAGES[0])

    // Load streak from localStorage
    const savedStats = localStorage.getItem('learnhub_stats')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setStreak(stats.streak || 0)
    }
  }, [])

  if (!isVisible) return null

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getStreakMessage = () => {
    if (streak === 0) return "Start your learning streak today!"
    if (streak === 1) return "You're on a 1-day streak! Keep it up!"
    if (streak < 7) return `${streak}-day streak! You're building momentum!`
    if (streak < 30) return `🔥 ${streak}-day streak! Incredible dedication!`
    return `🏆 ${streak}-day streak! You're a learning champion!`
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-navy-900/50 border border-primary-500/20 rounded-2xl">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-600/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative px-6 py-5 sm:px-8 sm:py-6">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-navy-400 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Greeting & Streak */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl animate-wave">{currentMessage.emoji}</span>
              <h3 className="text-white font-semibold text-lg">
                {getGreeting()}, Learner!
              </h3>
            </div>
            <p className="text-navy-300 text-sm mb-2">
              {currentMessage.message}
            </p>
            <p className="text-primary-400 text-sm font-medium">
              {getStreakMessage()}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{coursesCount}</p>
              <p className="text-navy-400 text-xs">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{lessonsCount}</p>
              <p className="text-navy-400 text-xs">Lessons</p>
            </div>
            {streak > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-400 flex items-center gap-1">
                  <span>🔥</span>
                  <span>{streak}</span>
                </p>
                <p className="text-navy-400 text-xs">Day Streak</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}