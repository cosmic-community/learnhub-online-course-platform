'use client'

import { useState, useEffect } from 'react'
import { markLessonComplete, isLessonComplete } from './LearningProgress'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
  onComplete?: () => void
}

export default function LessonCompleteButton({ courseSlug, lessonSlug, onComplete }: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCompleted(isLessonComplete(courseSlug, lessonSlug))
  }, [courseSlug, lessonSlug])

  const handleMarkComplete = () => {
    if (completed) return
    
    const isNew = markLessonComplete(courseSlug, lessonSlug)
    if (isNew) {
      setCompleted(true)
      setShowConfetti(true)
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('progress-updated'))
      
      onComplete?.()
    }
  }

  if (!mounted) {
    return (
      <button
        disabled
        className="btn-secondary opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    )
  }

  if (completed) {
    return (
      <>
        <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-lg font-semibold">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Lesson Completed!
        </div>
      </>
    )
  }

  return (
    <button
      onClick={handleMarkComplete}
      className="btn-primary group"
    >
      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Mark as Complete
    </button>
  )
}