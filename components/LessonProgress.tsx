'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface LessonProgressProps {
  lessonSlug: string
  lessonTitle: string
  durationMinutes?: number
}

interface ProgressData {
  completedLessons: string[]
  streak: number
  lastActiveDate: string
  totalMinutes: number
}

export default function LessonProgress({ lessonSlug, lessonTitle, durationMinutes = 30 }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('learnhub-progress')
    if (stored) {
      const data = JSON.parse(stored) as ProgressData
      setIsCompleted(data.completedLessons.includes(lessonSlug))
    }
  }, [lessonSlug])

  const toggleComplete = useCallback(() => {
    const stored = localStorage.getItem('learnhub-progress')
    let data: ProgressData = stored 
      ? JSON.parse(stored) 
      : { completedLessons: [], streak: 1, lastActiveDate: new Date().toISOString(), totalMinutes: 0 }

    if (isCompleted) {
      // Remove from completed
      data.completedLessons = data.completedLessons.filter(slug => slug !== lessonSlug)
      data.totalMinutes = Math.max(0, data.totalMinutes - durationMinutes)
    } else {
      // Add to completed
      if (!data.completedLessons.includes(lessonSlug)) {
        data.completedLessons.push(lessonSlug)
        data.totalMinutes += durationMinutes
        
        // Show confetti celebration!
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }

    // Update last active date
    data.lastActiveDate = new Date().toISOString()
    
    localStorage.setItem('learnhub-progress', JSON.stringify(data))
    setIsCompleted(!isCompleted)
    
    // Dispatch custom event so other components can update
    window.dispatchEvent(new CustomEvent('progress-updated'))
  }, [isCompleted, lessonSlug, durationMinutes])

  if (!mounted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-navy-800/50 rounded-xl animate-pulse">
        <div className="w-6 h-6 bg-navy-700 rounded-full"></div>
        <div className="h-4 bg-navy-700 rounded w-32"></div>
      </div>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      <button
        onClick={toggleComplete}
        className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 w-full group ${
          isCompleted 
            ? 'bg-green-500/20 border border-green-500/30 hover:bg-green-500/30' 
            : 'bg-navy-800/50 border border-navy-700 hover:bg-navy-800 hover:border-primary-500/50'
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          isCompleted 
            ? 'bg-green-500 text-white scale-110' 
            : 'bg-navy-700 text-navy-400 group-hover:bg-primary-500/20 group-hover:text-primary-400'
        }`}>
          {isCompleted ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </div>
        
        <div className="flex-1 text-left">
          <div className={`font-medium transition-colors ${
            isCompleted ? 'text-green-400' : 'text-white group-hover:text-primary-400'
          }`}>
            {isCompleted ? '✨ Lesson Completed!' : 'Mark as Complete'}
          </div>
          <div className="text-xs text-navy-400">
            {isCompleted 
              ? 'Click to undo' 
              : `Complete "${lessonTitle}" to track your progress`
            }
          </div>
        </div>
        
        {isCompleted && (
          <div className="text-2xl animate-bounce">🎉</div>
        )}
      </button>
    </>
  )
}