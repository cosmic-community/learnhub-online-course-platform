'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface LessonProgressProps {
  lessonSlug: string
  courseSlug: string
  lessonTitle: string
}

export default function LessonProgress({ lessonSlug, courseSlug, lessonTitle }: LessonProgressProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(0)

  const storageKey = `lesson-${courseSlug}-${lessonSlug}`
  const streakKey = 'learning-streak'
  const lastCompletedKey = 'last-lesson-completed'

  useEffect(() => {
    // Check if lesson is already complete
    const completed = localStorage.getItem(storageKey)
    if (completed) {
      setIsComplete(true)
    }

    // Calculate streak
    const lastCompleted = localStorage.getItem(lastCompletedKey)
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0', 10)
    
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted).toDateString()
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastDate === today || lastDate === yesterday) {
        setStreak(currentStreak)
      } else {
        // Streak broken, reset
        localStorage.setItem(streakKey, '0')
        setStreak(0)
      }
    }
  }, [storageKey])

  const handleComplete = useCallback(() => {
    if (isComplete) {
      // Uncomplete the lesson
      localStorage.removeItem(storageKey)
      setIsComplete(false)
    } else {
      // Complete the lesson
      localStorage.setItem(storageKey, 'true')
      setIsComplete(true)
      setShowConfetti(true)

      // Update streak
      const lastCompleted = localStorage.getItem(lastCompletedKey)
      const currentStreak = parseInt(localStorage.getItem(streakKey) || '0', 10)
      const today = new Date().toDateString()
      
      if (!lastCompleted || new Date(lastCompleted).toDateString() !== today) {
        const newStreak = currentStreak + 1
        localStorage.setItem(streakKey, newStreak.toString())
        localStorage.setItem(lastCompletedKey, new Date().toISOString())
        setStreak(newStreak)
      }

      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }, [isComplete, storageKey])

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-navy-900/50 border border-navy-800">
        <button
          onClick={handleComplete}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isComplete
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-navy-800 text-navy-300 border border-navy-700 hover:bg-navy-700 hover:text-white'
          }`}
        >
          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isComplete ? 'border-green-500 bg-green-500' : 'border-navy-500'
          }`}>
            {isComplete && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          {isComplete ? 'Completed!' : 'Mark as Complete'}
        </button>

        {streak > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-2xl">🔥</span>
            <span className="text-navy-300">
              <span className="font-bold text-orange-400">{streak}</span> day{streak !== 1 ? 's' : ''} streak!
            </span>
          </div>
        )}

        {isComplete && (
          <span className="text-sm text-navy-400">
            Great job completing this lesson!
          </span>
        )}
      </div>
    </>
  )
}