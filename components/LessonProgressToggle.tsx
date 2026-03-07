'use client'

import { useState, useEffect } from 'react'
import { markLessonComplete, markLessonIncomplete, getCourseProgress } from '@/lib/progress'

interface LessonProgressToggleProps {
  courseSlug: string
  lessonSlug: string
  onToggle?: (isComplete: boolean) => void
}

export default function LessonProgressToggle({ 
  courseSlug, 
  lessonSlug,
  onToggle 
}: LessonProgressToggleProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const progress = getCourseProgress(courseSlug)
    if (progress) {
      setIsComplete(progress.completedLessons.includes(lessonSlug))
    }
  }, [courseSlug, lessonSlug])

  const handleToggle = () => {
    setIsAnimating(true)
    
    if (isComplete) {
      markLessonIncomplete(courseSlug, lessonSlug)
      setIsComplete(false)
      onToggle?.(false)
    } else {
      markLessonComplete(courseSlug, lessonSlug)
      setIsComplete(true)
      onToggle?.(true)
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
        ${isComplete 
          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
          : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
        }
        ${isAnimating ? 'scale-95' : 'scale-100'}
      `}
    >
      <span className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${isComplete 
          ? 'border-green-400 bg-green-400' 
          : 'border-navy-500'
        }
      `}>
        {isComplete && (
          <svg 
            className="w-3 h-3 text-navy-900" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </span>
      {isComplete ? 'Completed!' : 'Mark as Complete'}
    </button>
  )
}