'use client'

import { useState, useEffect } from 'react'
import { isLessonComplete, markLessonComplete, markLessonIncomplete } from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCompletionButtonProps {
  courseSlug: string
  lessonSlug: string
  totalLessons: number
  onProgressChange?: (completedCount: number) => void
}

export default function LessonCompletionButton({
  courseSlug,
  lessonSlug,
  totalLessons,
  onProgressChange
}: LessonCompletionButtonProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check initial state
    setIsComplete(isLessonComplete(courseSlug, lessonSlug))
  }, [courseSlug, lessonSlug])

  const handleToggle = () => {
    setIsAnimating(true)
    
    if (isComplete) {
      const progress = markLessonIncomplete(courseSlug, lessonSlug)
      setIsComplete(false)
      onProgressChange?.(progress?.completedLessons.length ?? 0)
    } else {
      const progress = markLessonComplete(courseSlug, lessonSlug)
      setIsComplete(true)
      onProgressChange?.(progress.completedLessons.length)
      
      // Show confetti if this completes the course!
      if (progress.completedLessons.length === totalLessons) {
        setShowConfetti(true)
      }
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300
          ${isAnimating ? 'scale-95' : 'scale-100'}
          ${isComplete 
            ? 'bg-primary-500/20 text-primary-400 border-2 border-primary-500/50 hover:bg-primary-500/30' 
            : 'bg-navy-800 text-white border-2 border-navy-700 hover:bg-navy-700 hover:border-primary-500/50'
          }
        `}
      >
        <span className={`
          w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
          ${isComplete 
            ? 'bg-primary-500 text-white' 
            : 'border-2 border-navy-600'
          }
        `}>
          {isComplete && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        
        <span>
          {isComplete ? 'Completed! 🎉' : 'Mark as Complete'}
        </span>
      </button>
    </>
  )
}