'use client'

import { useState, useCallback } from 'react'
import Confetti from './Confetti'

interface LessonCompleteProps {
  lessonTitle: string
  lessonSlug: string
  courseSlug: string
}

export default function LessonComplete({ lessonTitle, lessonSlug, courseSlug }: LessonCompleteProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Check localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const key = `lesson-complete-${courseSlug}-${lessonSlug}`
      const completed = localStorage.getItem(key)
      if (completed === 'true') {
        setIsComplete(true)
      }
    }
  })

  const handleComplete = useCallback(() => {
    if (!isComplete) {
      setIsComplete(true)
      setShowConfetti(true)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        const key = `lesson-complete-${courseSlug}-${lessonSlug}`
        localStorage.setItem(key, 'true')
      }
      
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [isComplete, courseSlug, lessonSlug])

  const handleUndo = useCallback(() => {
    setIsComplete(false)
    if (typeof window !== 'undefined') {
      const key = `lesson-complete-${courseSlug}-${lessonSlug}`
      localStorage.removeItem(key)
    }
  }, [courseSlug, lessonSlug])

  return (
    <div className="relative">
      {showConfetti && <Confetti />}
      
      <div className={`p-6 rounded-2xl border transition-all duration-500 ${
        isComplete 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-navy-800/50 border-navy-700'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isComplete 
                ? 'bg-green-500 text-white scale-110' 
                : 'bg-navy-700 text-navy-400'
            }`}>
              {isComplete ? (
                <svg className="w-6 h-6 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`font-semibold transition-colors ${
                isComplete ? 'text-green-400' : 'text-white'
              }`}>
                {isComplete ? '🎉 Lesson Complete!' : 'Mark as Complete'}
              </h3>
              <p className="text-sm text-navy-400">
                {isComplete 
                  ? `You've completed "${lessonTitle}"` 
                  : 'Click when you finish this lesson'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isComplete ? (
              <button
                onClick={handleUndo}
                className="text-sm text-navy-400 hover:text-white transition-colors"
              >
                Undo
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="btn-primary"
              >
                Complete Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}