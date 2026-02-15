'use client'

import { useState, useEffect } from 'react'

interface LessonCompletionTrackerProps {
  lessonSlug: string
  courseSlug: string
}

export default function LessonCompletionTracker({ lessonSlug, courseSlug }: LessonCompletionTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-completed-lessons')
    const completedLessons: string[] = stored ? JSON.parse(stored) : []
    const lessonKey = `${courseSlug}/${lessonSlug}`
    
    setIsCompleted(completedLessons.includes(lessonKey))
  }, [lessonSlug, courseSlug])

  const toggleCompletion = () => {
    const stored = localStorage.getItem('learnhub-completed-lessons')
    const completedLessons: string[] = stored ? JSON.parse(stored) : []
    const lessonKey = `${courseSlug}/${lessonSlug}`

    if (completedLessons.includes(lessonKey)) {
      // Remove from completed
      const updated = completedLessons.filter(l => l !== lessonKey)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(updated))
      setIsCompleted(false)
    } else {
      // Add to completed
      completedLessons.push(lessonKey)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
      setIsCompleted(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  return (
    <div className="relative">
      {showCelebration && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-2xl">
          🎉
        </div>
      )}
      <button
        onClick={toggleCompletion}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark Complete
          </>
        )}
      </button>
    </div>
  )
}