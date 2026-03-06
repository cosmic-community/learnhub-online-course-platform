'use client'

import { useState, useCallback } from 'react'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  lessonId: string
  lessonSlug: string
  courseSlug: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalLessonsCompleted: number
}

export default function LessonCompleteButton({ lessonId, lessonSlug, courseSlug }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    const completed = localStorage.getItem(`lesson-completed-${lessonId}`)
    return completed === 'true'
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleComplete = useCallback(() => {
    if (isCompleted || isAnimating) return

    setIsAnimating(true)
    setShowConfetti(true)
    setIsCompleted(true)

    // Save lesson completion
    localStorage.setItem(`lesson-completed-${lessonId}`, 'true')
    
    // Update progress for course
    const courseProgress = JSON.parse(localStorage.getItem(`course-progress-${courseSlug}`) || '{}')
    courseProgress[lessonSlug] = true
    localStorage.setItem(`course-progress-${courseSlug}`, JSON.stringify(courseProgress))

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const streakData = localStorage.getItem('learnhub-streak')
    const streak: StreakData = streakData ? JSON.parse(streakData) : {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      totalLessonsCompleted: 0,
    }

    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate).toISOString().split('T')[0] : ''
    
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      if (lastActive === yesterdayStr) {
        // Continuing streak
        streak.currentStreak += 1
      } else if (lastActive !== today) {
        // New streak or broken streak
        streak.currentStreak = 1
      }
      
      streak.lastActiveDate = today
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak)
    }

    streak.totalLessonsCompleted += 1
    localStorage.setItem('learnhub-streak', JSON.stringify(streak))
    
    // Dispatch event for streak component to update
    window.dispatchEvent(new CustomEvent('streak-updated'))

    setTimeout(() => setIsAnimating(false), 1000)
  }, [isCompleted, isAnimating, lessonId, lessonSlug, courseSlug])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          relative overflow-hidden group
          px-6 py-3 rounded-xl font-semibold text-lg
          transition-all duration-300 transform
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-default' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25'
          }
        `}
      >
        {/* Animated background */}
        {!isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        <span className="relative flex items-center gap-2">
          {isCompleted ? (
            <>
              <svg className="w-5 h-5 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lesson Completed! 🎉
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark as Complete
            </>
          )}
        </span>
      </button>
    </>
  )
}