'use client'

import { useEffect, useState, useCallback } from 'react'
import Confetti from './Confetti'
import { recordLearningActivity } from './LearningStreak'

interface LessonProgressProps {
  courseSlug: string
  lessonSlug: string
  totalLessons: number
  lessonOrder: number
}

interface CourseProgress {
  completedLessons: string[]
  lastAccessed: string
}

const PROGRESS_KEY = 'learnhub_course_progress'

function getProgress(courseSlug: string): CourseProgress {
  if (typeof window === 'undefined') {
    return { completedLessons: [], lastAccessed: '' }
  }
  
  try {
    const stored = localStorage.getItem(`${PROGRESS_KEY}_${courseSlug}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { completedLessons: [], lastAccessed: '' }
}

function saveProgress(courseSlug: string, progress: CourseProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${PROGRESS_KEY}_${courseSlug}`, JSON.stringify(progress))
}

export default function LessonProgress({
  courseSlug,
  lessonSlug,
  totalLessons,
  lessonOrder
}: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const progress = getProgress(courseSlug)
    setIsCompleted(progress.completedLessons.includes(lessonSlug))
    setCompletedCount(progress.completedLessons.length)
  }, [courseSlug, lessonSlug])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  const toggleComplete = () => {
    const progress = getProgress(courseSlug)
    
    if (isCompleted) {
      // Unmark as complete
      progress.completedLessons = progress.completedLessons.filter(slug => slug !== lessonSlug)
      setCompletedCount(prev => prev - 1)
    } else {
      // Mark as complete
      if (!progress.completedLessons.includes(lessonSlug)) {
        progress.completedLessons.push(lessonSlug)
        setCompletedCount(prev => prev + 1)
        
        // Record learning activity for streak
        recordLearningActivity()
        
        // Show confetti for milestone completions
        if (progress.completedLessons.length === totalLessons) {
          // Course complete!
          setShowConfetti(true)
        } else if (progress.completedLessons.length === 1) {
          // First lesson!
          setShowConfetti(true)
        } else if (progress.completedLessons.length % 5 === 0) {
          // Every 5 lessons
          setShowConfetti(true)
        }
      }
    }
    
    progress.lastAccessed = new Date().toISOString()
    saveProgress(courseSlug, progress)
    setIsCompleted(!isCompleted)
  }

  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isCourseDone = completedCount === totalLessons && totalLessons > 0

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="card p-6 space-y-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Your Progress</h3>
          <span className="text-sm text-navy-400">
            {completedCount} / {totalLessons} lessons
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-navy-800 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Complete Button */}
        <button
          onClick={toggleComplete}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
          }`}
        >
          {isCompleted ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark as Complete
            </>
          )}
        </button>

        {/* Celebration Message */}
        {isCourseDone && (
          <div className="text-center py-4 bg-gradient-to-r from-yellow-500/10 to-primary-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-lg font-semibold text-white">Course Complete!</div>
            <div className="text-sm text-navy-400">Amazing work! You did it!</div>
          </div>
        )}

        {/* Lesson Indicator */}
        <div className="text-center text-xs text-navy-500">
          Lesson {lessonOrder} of {totalLessons}
        </div>
      </div>
    </>
  )
}