'use client'

import { useState, useEffect } from 'react'
import ConfettiCelebration from './ConfettiCelebration'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
  lessonTitle: string
}

interface CompletedLessons {
  [key: string]: boolean
}

export default function LessonCompleteButton({ lessonSlug, courseSlug, lessonTitle }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const lessonKey = `${courseSlug}/${lessonSlug}`

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-completed-lessons')
    if (stored) {
      const completedLessons: CompletedLessons = JSON.parse(stored)
      setIsCompleted(!!completedLessons[lessonKey])
    }
  }, [lessonKey])

  const handleComplete = () => {
    if (isCompleted) return

    // Mark lesson as complete
    const stored = localStorage.getItem('learnhub-completed-lessons')
    const completedLessons: CompletedLessons = stored ? JSON.parse(stored) : {}
    completedLessons[lessonKey] = true
    localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))

    // Update streak data
    const streakStored = localStorage.getItem('learnhub-streak')
    if (streakStored) {
      const streakData = JSON.parse(streakStored)
      const today = new Date().toDateString()
      
      if (streakData.lastVisit === today) {
        streakData.lessonsCompletedToday += 1
      } else {
        streakData.lessonsCompletedToday = 1
        streakData.lastVisit = today
      }
      
      localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
    }

    setIsCompleted(true)
    setShowConfetti(true)
    setJustCompleted(true)

    // Dispatch event for streak component to update
    window.dispatchEvent(new CustomEvent('lesson-completed'))
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
  }

  return (
    <>
      <ConfettiCelebration trigger={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="mt-8 p-6 bg-navy-900/50 border border-navy-800 rounded-xl">
        {isCompleted ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {justCompleted ? '🎉 Lesson Completed!' : 'Completed'}
                </p>
                <p className="text-sm text-navy-400">
                  {justCompleted ? 'Great job! Keep up the momentum!' : 'You\'ve finished this lesson'}
                </p>
              </div>
            </div>
            {justCompleted && (
              <div className="text-right">
                <p className="text-2xl">🔥</p>
                <p className="text-xs text-navy-400">+1 to streak!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Ready to move on?</p>
              <p className="text-sm text-navy-400">Mark this lesson as complete to track your progress</p>
            </div>
            <button
              onClick={handleComplete}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete Lesson
            </button>
          </div>
        )}
      </div>
    </>
  )
}