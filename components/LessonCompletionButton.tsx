'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LessonCompletionButtonProps {
  lessonSlug: string
  courseSlug: string
  nextLessonSlug?: string
}

export default function LessonCompletionButton({ 
  lessonSlug, 
  courseSlug, 
  nextLessonSlug 
}: LessonCompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const completedKey = `lesson-complete-${courseSlug}-${lessonSlug}`
    const completed = localStorage.getItem(completedKey) === 'true'
    setIsCompleted(completed)
  }, [lessonSlug, courseSlug])

  const handleComplete = () => {
    const completedKey = `lesson-complete-${courseSlug}-${lessonSlug}`
    localStorage.setItem(completedKey, 'true')
    setIsCompleted(true)
    setShowCelebration(true)
    
    // Dispatch event for confetti
    window.dispatchEvent(new CustomEvent('lesson-completed'))
    
    // Update streak
    const today = new Date().toDateString()
    const lastActivity = localStorage.getItem('last-learning-date')
    const currentStreak = parseInt(localStorage.getItem('learning-streak') || '0')
    
    if (lastActivity !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActivity === yesterday.toDateString()) {
        localStorage.setItem('learning-streak', String(currentStreak + 1))
      } else {
        localStorage.setItem('learning-streak', '1')
      }
      localStorage.setItem('last-learning-date', today)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-8 border-t border-navy-800">
      {!isCompleted ? (
        <button
          onClick={handleComplete}
          className="btn-primary flex items-center gap-2"
        >
          <span>✓</span>
          Mark as Complete
        </button>
      ) : (
        <div className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-lg font-semibold">
          <span>✓</span>
          Completed!
        </div>
      )}
      
      {nextLessonSlug && (
        <Link
          href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
          className="btn-secondary flex items-center gap-2"
        >
          Next Lesson
          <span>→</span>
        </Link>
      )}
    </div>
  )
}