'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  isLessonCompleted,
  markLessonComplete,
  markLessonIncomplete,
} from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  courseSlug: string
  courseName: string
  lessonSlug: string
  totalLessons: number
  onProgressChange?: (completed: boolean) => void
}

export default function LessonCompleteButton({
  courseSlug,
  courseName,
  lessonSlug,
  totalLessons,
  onProgressChange,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check completion status on mount
    const completed = isLessonCompleted(courseSlug, lessonSlug)
    setIsCompleted(completed)
    setIsLoading(false)
  }, [courseSlug, lessonSlug])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  const handleToggle = () => {
    if (isCompleted) {
      // Mark as incomplete
      markLessonIncomplete(courseSlug, lessonSlug)
      setIsCompleted(false)
      onProgressChange?.(false)
    } else {
      // Mark as complete
      markLessonComplete(courseSlug, courseName, lessonSlug, totalLessons)
      setIsCompleted(true)
      setShowConfetti(true)
      onProgressChange?.(true)
    }
  }

  if (isLoading) {
    return (
      <div className="h-12 bg-navy-800 rounded-lg animate-pulse" />
    )
  }

  return (
    <>
      <Confetti active={showConfetti} onComplete={handleConfettiComplete} />
      <button
        onClick={handleToggle}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Completed! Click to undo
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
    </>
  )
}