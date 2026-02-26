'use client'

import { useState, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface LessonCompleteProps {
  lessonTitle: string
  courseSlug: string
  lessonSlug: string
}

export default function LessonComplete({ lessonTitle, courseSlug, lessonSlug }: LessonCompleteProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [mounted, setMounted] = useState(false)

  const storageKey = `lesson-${courseSlug}-${lessonSlug}`

  useEffect(() => {
    setMounted(true)
    const completed = localStorage.getItem(storageKey) === 'true'
    setIsCompleted(completed)
  }, [storageKey])

  const fireConfetti = useCallback(() => {
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
      scalar: 0.8,
      colors: ['#22c55e', '#10b981', '#059669'],
    })
    fire(0.2, {
      spread: 60,
      scalar: 1.2,
      colors: ['#22c55e', '#10b981', '#059669'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#22c55e', '#10b981', '#059669'],
    })
  }, [])

  const handleComplete = useCallback(() => {
    if (isCompleted) return

    setIsCompleted(true)
    setShowCelebration(true)
    localStorage.setItem(storageKey, 'true')

    // Update global progress
    const savedProgress = localStorage.getItem('learnhub-progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      progress.completedLessons = (progress.completedLessons || 0) + 1
      progress.lastVisit = new Date().toDateString()
      localStorage.setItem('learnhub-progress', JSON.stringify(progress))
    }

    // Fire confetti!
    fireConfetti()

    // Hide celebration after 3 seconds
    setTimeout(() => setShowCelebration(false), 3000)
  }, [isCompleted, storageKey, fireConfetti])

  const handleUndo = useCallback(() => {
    setIsCompleted(false)
    localStorage.removeItem(storageKey)

    // Update global progress
    const savedProgress = localStorage.getItem('learnhub-progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      progress.completedLessons = Math.max(0, (progress.completedLessons || 0) - 1)
      localStorage.setItem('learnhub-progress', JSON.stringify(progress))
    }
  }, [storageKey])

  if (!mounted) {
    return (
      <div className="mt-8 p-6 bg-navy-800/50 rounded-xl border border-navy-700 animate-pulse">
        <div className="h-12 bg-navy-700 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="mt-8 relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <div className="text-2xl font-bold">Lesson Complete!</div>
              <div className="text-green-100">Great job! Keep up the momentum!</div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Card */}
      <div className={`p-6 rounded-xl border transition-all duration-500 ${
        isCompleted
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
          : 'bg-navy-800/50 border-navy-700'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-navy-700 text-navy-400'
            }`}>
              {isCompleted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h4 className={`font-semibold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                {isCompleted ? 'Lesson Completed!' : 'Mark as Complete'}
              </h4>
              <p className="text-navy-400 text-sm">
                {isCompleted 
                  ? "You've mastered this lesson. Great work!"
                  : 'Mark this lesson as complete when you\'re done'
                }
              </p>
            </div>
          </div>

          {isCompleted ? (
            <button
              onClick={handleUndo}
              className="px-4 py-2 text-navy-400 hover:text-white text-sm transition-colors"
            >
              Undo
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-primary flex items-center gap-2"
            >
              <span>Complete Lesson</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Progress hint */}
        {!isCompleted && (
          <div className="mt-4 pt-4 border-t border-navy-700 flex items-center gap-2 text-sm text-navy-400">
            <span>💡</span>
            <span>Completing lessons helps track your progress and maintains your streak!</span>
          </div>
        )}
      </div>
    </div>
  )
}