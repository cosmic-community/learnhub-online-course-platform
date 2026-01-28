'use client'

import { useState, useEffect, useCallback } from 'react'
import ConfettiCelebration from './ConfettiCelebration'

interface LessonCompletionTrackerProps {
  lessonSlug: string
  courseSlug: string
  totalLessons: number
}

export default function LessonCompletionTracker({ 
  lessonSlug, 
  courseSlug,
  totalLessons 
}: LessonCompletionTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    // Load completion status
    const completedLessons = JSON.parse(localStorage.getItem(`learnhub-completed-${courseSlug}`) || '[]')
    setCompletedCount(completedLessons.length)
    setIsCompleted(completedLessons.includes(lessonSlug))
  }, [lessonSlug, courseSlug])

  const markComplete = useCallback(() => {
    if (isCompleted) return

    const completedLessons = JSON.parse(localStorage.getItem(`learnhub-completed-${courseSlug}`) || '[]')
    
    if (!completedLessons.includes(lessonSlug)) {
      completedLessons.push(lessonSlug)
      localStorage.setItem(`learnhub-completed-${courseSlug}`, JSON.stringify(completedLessons))
      
      // Update streak data
      const streakData = JSON.parse(localStorage.getItem('learnhub-streak') || '{}')
      streakData.lessonsCompleted = (streakData.lessonsCompleted || 0) + 1
      localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
      
      setIsCompleted(true)
      setCompletedCount(completedLessons.length)
      setShowConfetti(true)
    }
  }, [isCompleted, lessonSlug, courseSlug])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  return (
    <>
      <ConfettiCelebration trigger={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Track Your Progress</h3>
            <p className="text-navy-400 text-sm">
              {completedCount} of {totalLessons} lessons completed
            </p>
            <div className="w-48 h-2 bg-navy-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={markComplete}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isCompleted
                ? 'bg-green-500/20 text-green-400 cursor-default'
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105'
            }`}
          >
            {isCompleted ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Completed!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as Complete
              </>
            )}
          </button>
        </div>
        
        {isCompleted && progress === 100 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/20 to-green-500/20 rounded-lg border border-primary-500/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="text-white font-semibold">Congratulations!</p>
                <p className="text-navy-300 text-sm">You've completed all lessons in this course!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}