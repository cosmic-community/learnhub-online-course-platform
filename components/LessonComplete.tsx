'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface LessonCompleteProps {
  courseSlug: string
  lessonSlug: string
  onComplete?: () => void
}

export default function LessonComplete({ courseSlug, lessonSlug, onComplete }: LessonCompleteProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const progressKey = `learnhub-progress-${courseSlug}`
    const stored = localStorage.getItem(progressKey)
    if (stored) {
      const progress = JSON.parse(stored)
      if (progress.completed?.includes(lessonSlug)) {
        setIsCompleted(true)
      }
    }
  }, [courseSlug, lessonSlug])

  const handleComplete = useCallback(() => {
    if (isCompleted) return

    // Save progress
    const progressKey = `learnhub-progress-${courseSlug}`
    const stored = localStorage.getItem(progressKey)
    const progress = stored ? JSON.parse(stored) : { completed: [] }
    
    if (!progress.completed.includes(lessonSlug)) {
      progress.completed.push(lessonSlug)
      progress.lastCompleted = new Date().toISOString()
      localStorage.setItem(progressKey, JSON.stringify(progress))
    }

    // Update total lessons completed for achievements
    const totalLessons = parseInt(localStorage.getItem('learnhub-total-lessons') || '0') + 1
    localStorage.setItem('learnhub-total-lessons', totalLessons.toString())

    setIsCompleted(true)
    setJustCompleted(true)
    setShowConfetti(true)
    
    setTimeout(() => setShowConfetti(false), 4000)
    
    onComplete?.()
  }, [isCompleted, courseSlug, lessonSlug, onComplete])

  return (
    <>
      {showConfetti && <Confetti />}
      
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30 cursor-default'
            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:scale-[1.02]'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {justCompleted ? 'Lesson Completed! 🎉' : 'Completed'}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
    </>
  )
}