'use client'

import { useState, useEffect } from 'react'
import { markLessonCompleted, isLessonCompleted } from '@/lib/progress'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
  nextLessonUrl?: string | null
}

export default function LessonCompleteButton({
  courseSlug,
  lessonSlug,
  nextLessonUrl,
}: LessonCompleteButtonProps) {
  const [completed, setCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setCompleted(isLessonCompleted(courseSlug, lessonSlug))
  }, [courseSlug, lessonSlug])
  
  const handleComplete = () => {
    const isNewCompletion = markLessonCompleted(courseSlug, lessonSlug)
    setCompleted(true)
    
    if (isNewCompletion) {
      setShowConfetti(true)
    }
  }
  
  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <button disabled className="btn-primary opacity-50">
          <span className="w-5 h-5 mr-2 rounded-full border-2 border-current" />
          Loading...
        </button>
      </div>
    )
  }
  
  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-navy-900/50 rounded-xl border border-navy-800">
        {completed ? (
          <div className="flex items-center gap-3 text-primary-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span className="text-lg font-semibold">Lesson Completed!</span>
          </div>
        ) : (
          <button onClick={handleComplete} className="btn-primary group">
            <span className="w-5 h-5 mr-2 rounded-full border-2 border-current group-hover:bg-white/20 transition-colors" />
            Mark as Complete
          </button>
        )}
        
        {nextLessonUrl && (
          <a
            href={nextLessonUrl}
            className={`btn-secondary ${completed ? 'animate-pulse-subtle' : ''}`}
          >
            Next Lesson
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </>
  )
}