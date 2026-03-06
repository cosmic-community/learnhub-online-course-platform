'use client'

import { useEffect, useState } from 'react'
import { incrementLessonCount } from './LearningStreak'

interface LessonProgressProps {
  lessonSlug: string
  courseSlug: string
}

export default function LessonProgress({ lessonSlug, courseSlug }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`
    setIsCompleted(completedLessons.includes(lessonKey))
  }, [lessonSlug, courseSlug])

  const handleMarkComplete = () => {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`

    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey)
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons))
      setIsCompleted(true)
      
      // Increment streak counter
      incrementLessonCount()
      
      // Show confirmation
      setShowConfirmation(true)
      setTimeout(() => setShowConfirmation(false), 3000)
    }
  }

  const handleMarkIncomplete = () => {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`
    const filtered = completedLessons.filter((l: string) => l !== lessonKey)
    localStorage.setItem('completed-lessons', JSON.stringify(filtered))
    setIsCompleted(false)
  }

  return (
    <div className="relative">
      {/* Confirmation Toast */}
      {showConfirmation && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Lesson completed! +1 to your streak 🔥
          </span>
        </div>
      )}

      {isCompleted ? (
        <button
          onClick={handleMarkIncomplete}
          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          Completed
        </button>
      ) : (
        <button
          onClick={handleMarkComplete}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-navy-200 border border-navy-700 rounded-lg hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
          </svg>
          Mark as Complete
        </button>
      )}
    </div>
  )
}