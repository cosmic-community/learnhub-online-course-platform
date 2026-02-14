'use client'

import { useState, useEffect } from 'react'

interface LearningStreakProps {
  className?: string
}

const motivationalTips = [
  { emoji: '🎯', tip: "Focus on one concept at a time. Mastery comes from depth, not breadth." },
  { emoji: '🧠', tip: "Teaching what you learn helps you remember 90% more!" },
  { emoji: '⏰', tip: "Just 25 minutes of focused learning beats hours of distracted study." },
  { emoji: '🔄', tip: "Review yesterday's lesson for 5 minutes before starting new content." },
  { emoji: '✍️', tip: "Code along with tutorials—muscle memory is real for programmers!" },
  { emoji: '🌟', tip: "Celebrate small wins. Every function you write is progress." },
  { emoji: '🤔', tip: "Stuck? Take a 10-minute walk. Your brain solves problems in the background." },
  { emoji: '📝', tip: "Write comments explaining your code. Future you will thank present you." },
  { emoji: '🚀', tip: "Ship something small today. Done is better than perfect." },
  { emoji: '🔥', tip: "Consistency beats intensity. 30 minutes daily > 5 hours on weekends." },
  { emoji: '💡', tip: "Error messages are teachers in disguise. Read them carefully!" },
  { emoji: '🎨', tip: "Experiment freely. The best learning happens when you break things." },
  { emoji: '🤝', tip: "Join a community. Learning together accelerates growth." },
  { emoji: '📚', tip: "Read other people's code. It's like learning vocabulary for programming." },
  { emoji: '🎮', tip: "Make learning fun! Build projects you're excited about." },
]

const milestoneMessages = [
  { days: 3, message: "3-day streak! You're building momentum! 🌱" },
  { days: 7, message: "One week strong! You're a learning machine! 💪" },
  { days: 14, message: "Two weeks! Your dedication is inspiring! ⭐" },
  { days: 30, message: "30 days! You're unstoppable! 🏆" },
  { days: 50, message: "50 days! You're in the top 1% of learners! 🔥" },
  { days: 100, message: "100 DAYS! LEGENDARY STATUS! 👑" },
]

export default function LearningStreak({ className = '' }: LearningStreakProps) {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dailyTip, setDailyTip] = useState(motivationalTips[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get or initialize streak from localStorage
    const storedData = localStorage.getItem('learnhub_streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const { lastVisit, currentStreak } = JSON.parse(storedData)
      const lastVisitDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day, keep streak
        setStreak(currentStreak)
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub_streak', JSON.stringify({
          lastVisit: today,
          currentStreak: newStreak
        }))
        
        // Check for milestone
        const milestone = milestoneMessages.find(m => m.days === newStreak)
        if (milestone) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learnhub_streak', JSON.stringify({
          lastVisit: today,
          currentStreak: 1
        }))
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem('learnhub_streak', JSON.stringify({
        lastVisit: today,
        currentStreak: 1
      }))
    }
    
    // Select daily tip based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setDailyTip(motivationalTips[dayOfYear % motivationalTips.length])
    
    // Trigger animation
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const getMilestoneProgress = () => {
    const nextMilestone = milestoneMessages.find(m => m.days > streak) || milestoneMessages[milestoneMessages.length - 1]
    const prevMilestone = [...milestoneMessages].reverse().find(m => m.days <= streak)
    const prevDays = prevMilestone?.days || 0
    const progress = ((streak - prevDays) / (nextMilestone.days - prevDays)) * 100
    return { nextMilestone, progress: Math.min(progress, 100) }
  }

  const { nextMilestone, progress } = getMilestoneProgress()

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className={`relative ${className}`}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}
      
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        <div className="flex items-start gap-4">
          {/* Streak Counter */}
          <div className="relative">
            <div 
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 transition-transform duration-500 ${isAnimating ? 'scale-100' : 'scale-0'}`}
            >
              <div className="text-center">
                <span className="text-2xl font-bold text-white block leading-none">
                  {streak}
                </span>
                <span className="text-xs text-primary-100">
                  {streak === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
            {/* Flame icon for streaks > 1 */}
            {streak > 1 && (
              <span className="absolute -top-1 -right-1 text-2xl animate-bounce">
                🔥
              </span>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              Learning Streak
              {streak >= 7 && <span className="text-yellow-400">⭐</span>}
              {streak >= 30 && <span className="text-yellow-400">⭐</span>}
              {streak >= 100 && <span className="text-yellow-400">👑</span>}
            </h3>
            
            {/* Progress to next milestone */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-navy-400 mb-1">
                <span>Progress to {nextMilestone.days} days</span>
                <span>{streak}/{nextMilestone.days}</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Daily Tip */}
            <div className="p-3 bg-navy-800/50 rounded-lg border border-navy-700">
              <p className="text-sm text-navy-300">
                <span className="text-lg mr-2">{dailyTip.emoji}</span>
                <span className="text-primary-300 font-medium">Today's tip:</span>{' '}
                {dailyTip.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}