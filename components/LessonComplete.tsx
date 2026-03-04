'use client'

import { useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

interface LessonCompleteProps {
  lessonSlug: string
  courseSlug: string
  lessonTitle: string
  onComplete?: () => void
}

export default function LessonComplete({ lessonSlug, courseSlug, lessonTitle, onComplete }: LessonCompleteProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const progress = localStorage.getItem('learnhub-progress')
    if (progress) {
      const parsed = JSON.parse(progress)
      const lessonKey = `${courseSlug}-${lessonSlug}`
      setIsCompleted(parsed.completedLessons?.includes(lessonKey) || false)
    }
  }, [lessonSlug, courseSlug])

  const triggerCelebration = useCallback(() => {
    // Fire confetti!
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [])

  const handleComplete = () => {
    if (isCompleted) return

    // Update progress in localStorage
    const progress = localStorage.getItem('learnhub-progress')
    const parsed = progress ? JSON.parse(progress) : {
      completedLessons: [],
      startedCourses: [],
      totalTimeSpent: 0,
      streakDays: 1,
      lastVisit: new Date().toISOString()
    }

    const lessonKey = `${courseSlug}-${lessonSlug}`
    
    if (!parsed.completedLessons.includes(lessonKey)) {
      parsed.completedLessons.push(lessonKey)
      parsed.totalTimeSpent += 15 // Assume ~15 min per lesson
      
      if (!parsed.startedCourses.includes(courseSlug)) {
        parsed.startedCourses.push(courseSlug)
      }
      
      localStorage.setItem('learnhub-progress', JSON.stringify(parsed))
    }

    setIsCompleted(true)
    setShowCelebration(true)
    triggerCelebration()
    
    // Hide celebration after 3 seconds
    setTimeout(() => setShowCelebration(false), 3000)
    
    onComplete?.()
  }

  return (
    <div className="relative">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce-in bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <div className="font-bold text-lg">Lesson Complete!</div>
              <div className="text-primary-100 text-sm">Great job on &quot;{lessonTitle}&quot;</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 cursor-default'
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Completed!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mark as Complete</span>
          </>
        )}
      </button>
    </div>
  )
}