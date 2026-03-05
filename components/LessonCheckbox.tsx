'use client'

import { useEffect, useState } from 'react'
import { completeLesson, uncompleteLesson, isLessonComplete, startCourse } from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCheckboxProps {
  courseId: string
  courseSlug: string
  courseTitle: string
  lessonId: string
  totalLessons: number
  onComplete?: () => void
}

export default function LessonCheckbox({
  courseId,
  courseSlug,
  courseTitle,
  lessonId,
  totalLessons,
  onComplete,
}: LessonCheckboxProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCourseComplete, setShowCourseComplete] = useState(false)

  useEffect(() => {
    // Ensure course is started
    startCourse(courseId, courseSlug, courseTitle, totalLessons)
    setIsComplete(isLessonComplete(courseId, lessonId))
  }, [courseId, courseSlug, courseTitle, lessonId, totalLessons])

  const handleToggle = () => {
    if (isComplete) {
      uncompleteLesson(courseId, lessonId)
      setIsComplete(false)
    } else {
      const result = completeLesson(courseId, lessonId)
      setIsComplete(true)
      
      if (result.isNewCompletion) {
        setShowConfetti(true)
        
        if (result.isCourseComplete) {
          setShowCourseComplete(true)
        }
      }
    }

    // Dispatch custom event for same-tab progress updates
    window.dispatchEvent(new Event('progressUpdate'))
    onComplete?.()
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {showCourseComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md mx-4 text-center animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Course Complete!</h2>
            <p className="text-navy-300 mb-6">
              Congratulations! You&apos;ve completed all lessons in <span className="text-primary-400">{courseTitle}</span>!
            </p>
            <button
              onClick={() => setShowCourseComplete(false)}
              className="btn-primary"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleToggle}
        className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
          isComplete
            ? 'bg-primary-500/20 text-primary-400'
            : 'bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isComplete
              ? 'bg-primary-500 border-primary-500'
              : 'border-navy-600 group-hover:border-primary-500'
          }`}
        >
          {isComplete && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="font-medium">
          {isComplete ? 'Completed!' : 'Mark as Complete'}
        </span>
      </button>
    </>
  )
}