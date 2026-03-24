'use client'

import { useState, useEffect } from 'react'
import { useProgressTracker } from './LearningProgress'

interface LessonCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
}

export default function LessonCompleteButton({ courseSlug, lessonSlug }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { markComplete, isComplete } = useProgressTracker(courseSlug)

  useEffect(() => {
    setIsCompleted(isComplete(lessonSlug))
  }, [isComplete, lessonSlug])

  const handleComplete = () => {
    if (isCompleted) return
    
    setIsAnimating(true)
    markComplete(lessonSlug)
    setIsCompleted(true)
    
    setTimeout(() => setIsAnimating(false), 600)
  }

  if (isCompleted) {
    return (
      <div className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-green-500/20 text-green-400 
        font-semibold rounded-lg border border-green-500/30
        ${isAnimating ? 'animate-celebrate' : ''}
      `}>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Lesson Completed!
      </div>
    )
  }

  return (
    <button
      onClick={handleComplete}
      className="
        inline-flex items-center gap-2 px-6 py-3
        bg-primary-500 hover:bg-primary-600
        text-white font-semibold rounded-lg
        transition-all duration-200
        shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
        hover:scale-105 active:scale-95
      "
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Mark as Complete
    </button>
  )
}