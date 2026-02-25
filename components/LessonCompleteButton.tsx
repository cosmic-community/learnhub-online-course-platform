'use client'

import { useState, useEffect } from 'react'
import { trackLessonComplete } from './LearningProgress'

interface LessonCompleteButtonProps {
  lessonSlug: string
}

export default function LessonCompleteButton({ lessonSlug }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const completedKey = `lesson-completed-${lessonSlug}`
    const completed = localStorage.getItem(completedKey) === 'true'
    setIsCompleted(completed)
  }, [lessonSlug])

  const handleComplete = () => {
    if (isCompleted) return
    
    trackLessonComplete(lessonSlug)
    setIsCompleted(true)
    setShowAnimation(true)
    
    setTimeout(() => setShowAnimation(false), 2000)
  }

  return (
    <div className="relative">
      {/* Celebration Animation */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping-once text-4xl">🎉</div>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-2xl animate-float-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${20 + Math.random() * 60}%`,
              }}
            >
              {['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)]}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 w-full justify-center
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30 cursor-default' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02]'
          }
        `}
      >
        {isCompleted ? (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lesson Completed! 🎉
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
    </div>
  )
}