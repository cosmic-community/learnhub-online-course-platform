'use client'

import { useState, useEffect } from 'react'
import { 
  isLessonComplete, 
  markLessonComplete, 
  markLessonIncomplete 
} from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCompletionButtonProps {
  lessonId: string
  courseId: string
  courseSlug: string
  courseTitle: string
  courseThumbnail?: string
  totalLessons: number
}

export default function LessonCompletionButton({
  lessonId,
  courseId,
  courseSlug,
  courseTitle,
  courseThumbnail,
  totalLessons,
}: LessonCompletionButtonProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCourseComplete, setShowCourseComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check completion status on mount
    setIsComplete(isLessonComplete(lessonId))
    setIsLoading(false)
  }, [lessonId])

  const handleToggle = () => {
    if (isComplete) {
      markLessonIncomplete(lessonId, courseId, totalLessons)
      setIsComplete(false)
    } else {
      const { isNewCourseCompletion } = markLessonComplete(
        lessonId,
        courseId,
        courseSlug,
        courseTitle,
        courseThumbnail,
        totalLessons
      )
      setIsComplete(true)
      
      if (isNewCourseCompletion) {
        // Trigger celebration!
        setShowConfetti(true)
        setShowCourseComplete(true)
        setTimeout(() => {
          setShowConfetti(false)
          setShowCourseComplete(false)
        }, 5000)
      }
    }
  }

  if (isLoading) {
    return (
      <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
        <span className="animate-pulse">Loading...</span>
      </button>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      {showCourseComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-navy-900/95 border border-primary-500/50 rounded-2xl p-8 text-center animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Course Complete!</h3>
            <p className="text-navy-300">
              Congratulations on finishing<br />
              <span className="text-primary-400 font-semibold">{courseTitle}</span>
            </p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isComplete
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
        }`}
      >
        {isComplete ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
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
    </>
  )
}