'use client'

import { useState, useEffect } from 'react'
import ConfettiCelebration from './ConfettiCelebration'

interface LessonCompleteButtonProps {
  lessonId: string
  lessonTitle: string
}

export default function LessonCompleteButton({ lessonId, lessonTitle }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]') as string[]
    setIsCompleted(completedLessons.includes(lessonId))
  }, [lessonId])

  const handleComplete = () => {
    if (isCompleted) return

    // Mark as completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]') as string[]
    completedLessons.push(lessonId)
    localStorage.setItem('completed-lessons', JSON.stringify(completedLessons))

    // Update learning stats
    const stats = JSON.parse(localStorage.getItem('learnhub-stats') || '{}')
    stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1
    localStorage.setItem('learnhub-stats', JSON.stringify(stats))

    // Show celebration
    setShowConfetti(true)
    setIsCompleted(true)
  }

  return (
    <>
      <ConfettiCelebration 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg
          transition-all duration-300 transform
          ${isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lesson Completed!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark as Complete
          </span>
        )}
      </button>
    </>
  )
}