'use client'

import { useState, useEffect } from 'react'
import { 
  isLessonComplete, 
  markLessonComplete, 
  markLessonIncomplete 
} from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  lessonId: string
  lessonSlug: string
  courseId: string
  courseSlug: string
  courseTitle: string
  totalLessons: number
  nextLessonSlug?: string
}

export default function LessonCompleteButton({
  lessonId,
  lessonSlug,
  courseId,
  courseSlug,
  courseTitle,
  totalLessons,
  nextLessonSlug,
}: LessonCompleteButtonProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsComplete(isLessonComplete(lessonId))
  }, [lessonId])

  const handleToggle = () => {
    if (isComplete) {
      markLessonIncomplete(lessonId, courseId)
      setIsComplete(false)
    } else {
      markLessonComplete(lessonId, lessonSlug, courseId, courseSlug, courseTitle, totalLessons)
      setIsComplete(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  if (!mounted) {
    return (
      <button className="btn-secondary opacity-50" disabled>
        Loading...
      </button>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleToggle}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isComplete
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25'
          }`}
        >
          {isComplete ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Completed!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Mark as Complete
            </>
          )}
        </button>
        
        {isComplete && nextLessonSlug && (
          <a
            href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
            className="btn-primary flex items-center justify-center gap-2"
          >
            Next Lesson
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        )}
      </div>
    </>
  )
}