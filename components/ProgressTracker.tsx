'use client'

import { useState, useEffect, useCallback } from 'react'

interface ProgressTrackerProps {
  courseId: string
  totalLessons: number
  completedLessons?: string[]
}

export default function ProgressTracker({ courseId, totalLessons, completedLessons: initialCompleted = [] }: ProgressTrackerProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>(initialCompleted)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null)

  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`progress-${courseId}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setCompletedLessons(parsed.completedLessons || [])
      } catch {
        // Invalid data, start fresh
      }
    }

    // Load streak data
    const streakData = localStorage.getItem('learning-streak')
    if (streakData) {
      try {
        const parsed = JSON.parse(streakData)
        setStreak(parsed.streak || 0)
        setLastStudyDate(parsed.lastDate || null)
      } catch {
        // Invalid data
      }
    }
  }, [courseId])

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const streakData = localStorage.getItem('learning-streak')
    
    let currentStreak = 0
    let lastDate: string | null = null

    if (streakData) {
      try {
        const parsed = JSON.parse(streakData)
        currentStreak = parsed.streak || 0
        lastDate = parsed.lastDate || null
      } catch {
        // Start fresh
      }
    }

    if (lastDate === today) {
      // Already studied today
      return currentStreak
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastDate === yesterdayStr) {
      // Continued streak
      currentStreak += 1
    } else if (lastDate !== today) {
      // Streak broken
      currentStreak = 1
    }

    const newStreakData = { streak: currentStreak, lastDate: today }
    localStorage.setItem('learning-streak', JSON.stringify(newStreakData))
    setStreak(currentStreak)
    setLastStudyDate(today)

    return currentStreak
  }, [])

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev
      
      const newCompleted = [...prev, lessonId]
      
      // Save to localStorage
      localStorage.setItem(`progress-${courseId}`, JSON.stringify({
        completedLessons: newCompleted,
        lastUpdated: new Date().toISOString()
      }))

      // Trigger confetti!
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      // Update streak
      updateStreak()

      return newCompleted
    })
  }, [courseId, updateStreak])

  // Expose markLessonComplete to window for use by lesson pages
  useEffect(() => {
    const win = window as Window & { markLessonComplete?: (lessonId: string) => void }
    win.markLessonComplete = markLessonComplete
    return () => {
      delete win.markLessonComplete
    }
  }, [markLessonComplete])

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <span
                className="block w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'][Math.floor(Math.random() * 7)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Progress Card */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 px-3 py-1.5 rounded-full border border-orange-500/30">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-semibold text-orange-400">{streak} day streak!</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-navy-800 rounded-full overflow-hidden mb-3">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          {progressPercent > 0 && (
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400/50 to-transparent rounded-full animate-pulse"
              style={{ width: `${progressPercent}%` }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-navy-400">
            {completedLessons.length} of {totalLessons} lessons completed
          </span>
          <span className="font-semibold text-primary-400">{progressPercent}%</span>
        </div>

        {/* Milestone Badges */}
        {progressPercent >= 25 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              <span>🌱</span> Getting Started
            </span>
            {progressPercent >= 50 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                <span>⚡</span> Halfway There
              </span>
            )}
            {progressPercent >= 75 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                <span>🚀</span> Almost Done
              </span>
            )}
            {progressPercent === 100 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full animate-pulse">
                <span>🏆</span> Course Complete!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}