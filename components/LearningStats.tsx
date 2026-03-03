'use client'

import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  estimatedHours: number
}

export default function LearningStats({
  totalCourses,
  totalLessons,
  totalInstructors,
  estimatedHours,
}: LearningStatsProps) {
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [visitedToday, setVisitedToday] = useState(false)

  useEffect(() => {
    // Check and update learning streak
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem('learnhub-last-visit')
    const currentStreak = parseInt(localStorage.getItem('learnhub-streak') || '0', 10)
    
    if (lastVisit === today) {
      // Already visited today
      setStreak(currentStreak)
      setVisitedToday(true)
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', newStreak.toString())
        localStorage.setItem('learnhub-last-visit', today)
        
        // Show confetti for milestone streaks
        if (newStreak % 7 === 0 || newStreak === 1) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken or first visit
        setStreak(1)
        localStorage.setItem('learnhub-streak', '1')
        localStorage.setItem('learnhub-last-visit', today)
        
        if (!lastVisit) {
          // First time visitor
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    }
  }, [])

  const weekProgress = Math.min((streak / 7) * 100, 100)

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Learning Streak Card */}
        <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <ProgressRing
              progress={weekProgress}
              size={100}
              strokeWidth={6}
              color="#22c55e"
            >
              <div className="text-center">
                <span className="text-3xl font-bold text-white">{streak}</span>
                <span className="text-lg">🔥</span>
              </div>
            </ProgressRing>
          </div>
          <h3 className="font-semibold text-white mb-1">Learning Streak</h3>
          <p className="text-navy-400 text-sm">
            {streak === 1 ? "You're just getting started!" : 
             streak < 7 ? `${7 - streak} days to weekly goal!` :
             "Amazing dedication! 🎉"}
          </p>
        </div>

        {/* Total Courses Card */}
        <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
              <span className="text-4xl">📚</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1 tabular-nums">
            <AnimatedCounter target={totalCourses} />
          </div>
          <h3 className="font-medium text-navy-300">Total Courses</h3>
        </div>

        {/* Total Lessons Card */}
        <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
              <span className="text-4xl">📖</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1 tabular-nums">
            <AnimatedCounter target={totalLessons} />
          </div>
          <h3 className="font-medium text-navy-300">Total Lessons</h3>
        </div>

        {/* Learning Hours Card */}
        <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
              <span className="text-4xl">⏱️</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1 tabular-nums">
            <AnimatedCounter target={estimatedHours} />+
          </div>
          <h3 className="font-medium text-navy-300">Hours of Content</h3>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 text-center">
        <p className="text-navy-400 text-sm">
          {visitedToday ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Welcome back! Keep up the great work!
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span className="text-lg">✨</span>
              Start your learning journey today!
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

// Animated counter component for smooth number transitions
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500 // ms
    const steps = 60
    const stepTime = duration / steps
    const increment = target / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [target])

  return <>{count}</>
}