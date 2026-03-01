'use client'

import { useState, useEffect } from 'react'
import { markLessonCompleted } from './LearningProgress'

interface LessonProgressProps {
  lessonSlug: string
  durationMinutes?: number
}

export default function LessonProgress({ lessonSlug, durationMinutes = 0 }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setIsCompleted(stats.lessonsCompleted?.includes(lessonSlug) || false)
    }
  }, [lessonSlug])

  const handleComplete = () => {
    if (!isCompleted) {
      markLessonCompleted(lessonSlug, durationMinutes)
      setIsCompleted(true)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 cursor-default' 
            : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105 active:scale-95'
          }
        `}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce text-3xl">
          🎉
        </div>
      )}
    </div>
  )
}