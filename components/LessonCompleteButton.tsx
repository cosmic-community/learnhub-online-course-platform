'use client'

import { useState, useEffect } from 'react'
import { markLessonComplete, isLessonComplete } from './LearningStreak'

interface LessonCompleteButtonProps {
  lessonSlug: string
  durationMinutes: number
}

export default function LessonCompleteButton({ lessonSlug, durationMinutes }: LessonCompleteButtonProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsComplete(isLessonComplete(lessonSlug))
    setIsLoaded(true)
  }, [lessonSlug])

  const handleComplete = () => {
    if (!isComplete) {
      const wasNew = markLessonComplete(lessonSlug, durationMinutes)
      if (wasNew) {
        setIsComplete(true)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      }
    }
  }

  if (!isLoaded) {
    return (
      <button className="btn-secondary opacity-50" disabled>
        Loading...
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={handleComplete}
        disabled={isComplete}
        className={`relative overflow-hidden transition-all duration-300 ${
          isComplete
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-3 rounded-lg font-semibold'
            : 'btn-primary'
        }`}
      >
        {isComplete ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Lesson Completed!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </span>
        )}
      </button>

      {/* Celebration effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Burst animation */}
          <div className="absolute inset-0 animate-ping bg-green-500/20 rounded-lg" />
          
          {/* Confetti */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${50 + (Math.random() - 0.5) * 100}%`,
                top: '50%',
                width: '8px',
                height: '8px',
                backgroundColor: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f472b6'][i % 5],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${Math.random() * 0.3}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}