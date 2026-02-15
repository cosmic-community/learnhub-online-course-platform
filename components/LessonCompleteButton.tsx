'use client'

import { useState, useEffect } from 'react'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
}

const COMPLETED_KEY = 'learnhub-completed-lessons'
const PROGRESS_KEY = 'learnhub-progress'

export default function LessonCompleteButton({ lessonSlug, courseSlug }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = getCompletedLessons()
    const key = `${courseSlug}/${lessonSlug}`
    setIsCompleted(completedLessons.includes(key))
  }, [lessonSlug, courseSlug])

  const getCompletedLessons = (): string[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(COMPLETED_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  }

  const updateProgressStats = () => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return
    
    try {
      const stats = JSON.parse(stored)
      stats.totalLessonsCompleted = (stats.totalLessonsCompleted || 0) + 1
      
      // Check lesson achievements
      if (stats.totalLessonsCompleted >= 1) {
        stats.achievements = stats.achievements.map((a: { id: string; unlocked: boolean }) => 
          a.id === 'lesson-starter' && !a.unlocked
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      }
      
      if (stats.totalLessonsCompleted >= 5) {
        stats.achievements = stats.achievements.map((a: { id: string; unlocked: boolean }) => 
          a.id === 'knowledge-seeker' && !a.unlocked
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      }
      
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(stats))
    } catch {
      // Ignore errors
    }
  }

  const handleComplete = () => {
    const key = `${courseSlug}/${lessonSlug}`
    const completedLessons = getCompletedLessons()
    
    if (!completedLessons.includes(key)) {
      completedLessons.push(key)
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLessons))
      setIsCompleted(true)
      setShowCelebration(true)
      updateProgressStats()
      
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const handleUncomplete = () => {
    const key = `${courseSlug}/${lessonSlug}`
    const completedLessons = getCompletedLessons().filter(l => l !== key)
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLessons))
    setIsCompleted(false)
  }

  return (
    <div className="relative">
      {showCelebration && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium animate-bounce">
            🎉 Great job!
          </div>
        </div>
      )}
      
      {isCompleted ? (
        <button
          onClick={handleUncomplete}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Completed
        </button>
      ) : (
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark as Complete
        </button>
      )}
    </div>
  )
}