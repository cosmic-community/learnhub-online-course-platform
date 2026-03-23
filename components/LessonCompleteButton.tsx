'use client'

import { useState, useEffect } from 'react'

interface LessonCompleteButtonProps {
  lessonId: string
  courseId: string
}

export default function LessonCompleteButton({ lessonId, courseId }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const savedProgress = localStorage.getItem(`progress-${courseId}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        if (parsed.completedLessons?.includes(lessonId)) {
          setIsCompleted(true)
        }
      } catch {
        // Invalid data
      }
    }
  }, [lessonId, courseId])

  const handleComplete = () => {
    if (isCompleted) return

    setIsAnimating(true)
    
    // Get existing progress
    const savedProgress = localStorage.getItem(`progress-${courseId}`)
    let completedLessons: string[] = []
    
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        completedLessons = parsed.completedLessons || []
      } catch {
        // Start fresh
      }
    }

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId)
      localStorage.setItem(`progress-${courseId}`, JSON.stringify({
        completedLessons,
        lastUpdated: new Date().toISOString()
      }))

      // Update streak
      updateStreak()
    }

    setTimeout(() => {
      setIsCompleted(true)
      setIsAnimating(false)
      
      // Trigger confetti via custom event
      window.dispatchEvent(new CustomEvent('lesson-completed', { detail: { lessonId } }))
    }, 500)
  }

  const updateStreak = () => {
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
      return // Already studied today
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastDate === yesterdayStr) {
      currentStreak += 1
    } else {
      currentStreak = 1
    }

    localStorage.setItem('learning-streak', JSON.stringify({
      streak: currentStreak,
      lastDate: today
    }))
  }

  if (isCompleted) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 font-semibold rounded-lg border border-green-500/30 cursor-default"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Lesson Completed!
      </button>
    )
  }

  return (
    <button
      onClick={handleComplete}
      disabled={isAnimating}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 ${
        isAnimating ? 'scale-95 opacity-75' : ''
      }`}
    >
      {isAnimating ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Completing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark as Complete
        </>
      )}
    </button>
  )
}