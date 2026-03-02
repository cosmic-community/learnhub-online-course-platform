'use client'

import { useState, useCallback } from 'react'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
  totalLessons: number
}

export default function LessonCompleteButton({ 
  lessonSlug, 
  courseSlug, 
  totalLessons 
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(`lesson-completed-${courseSlug}-${lessonSlug}`)
    return stored === 'true'
  })
  const [showConfetti, setShowConfetti] = useState(false)

  const triggerConfetti = useCallback(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6']
    const confettiCount = 30

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`
      confetti.style.animationDelay = `${Math.random() * 0.3}s`
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 4000)
    }
  }, [])

  const handleComplete = () => {
    if (isCompleted) {
      // Uncomplete
      localStorage.removeItem(`lesson-completed-${courseSlug}-${lessonSlug}`)
      setIsCompleted(false)
      updateCourseProgress(courseSlug, -1, totalLessons)
    } else {
      // Complete
      localStorage.setItem(`lesson-completed-${courseSlug}-${lessonSlug}`, 'true')
      setIsCompleted(true)
      setShowConfetti(true)
      triggerConfetti()
      updateCourseProgress(courseSlug, 1, totalLessons)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const updateCourseProgress = (slug: string, delta: number, total: number) => {
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (!stored) return

    const recent = JSON.parse(stored)
    const courseIndex = recent.findIndex((c: { slug: string }) => c.slug === slug)
    
    if (courseIndex !== -1) {
      const currentProgress = recent[courseIndex].progress || 0
      const lessonsCompleted = Math.round((currentProgress / 100) * total) + delta
      recent[courseIndex].progress = Math.min(100, Math.max(0, (lessonsCompleted / total) * 100))
      localStorage.setItem('learnhub-recent-courses', JSON.stringify(recent))
    }
  }

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce-in">
          <span className="text-2xl">🎉</span>
        </div>
      )}
      <button
        onClick={handleComplete}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            : 'bg-navy-800 text-navy-200 border border-navy-700 hover:bg-navy-700 hover:text-white'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
    </div>
  )
}