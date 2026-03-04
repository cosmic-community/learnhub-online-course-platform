'use client'

import { useState, useCallback } from 'react'
import Confetti from './Confetti'
import { recordLearningActivity } from './LearningStreak'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
  lessonDuration?: number
  nextLessonSlug?: string | null
}

const COMPLETED_LESSONS_KEY = 'learnhub-completed-lessons'

function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(COMPLETED_LESSONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function markLessonComplete(lessonKey: string): void {
  if (typeof window === 'undefined') return
  try {
    const completed = getCompletedLessons()
    if (!completed.includes(lessonKey)) {
      completed.push(lessonKey)
      localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completed))
    }
  } catch (error) {
    console.error('Failed to mark lesson complete:', error)
  }
}

export default function LessonCompleteButton({ 
  lessonSlug, 
  courseSlug, 
  lessonDuration = 0,
  nextLessonSlug 
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    const lessonKey = `${courseSlug}/${lessonSlug}`
    return getCompletedLessons().includes(lessonKey)
  })
  const [showConfetti, setShowConfetti] = useState(false)

  const handleComplete = useCallback(() => {
    if (isCompleted) return

    const lessonKey = `${courseSlug}/${lessonSlug}`
    
    // Mark lesson as complete
    markLessonComplete(lessonKey)
    setIsCompleted(true)
    
    // Record learning activity for streak
    recordLearningActivity(lessonDuration)
    
    // Show confetti celebration
    setShowConfetti(true)
  }, [isCompleted, courseSlug, lessonSlug, lessonDuration])

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false)
  }, [])

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
      
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-8 border-t border-navy-700">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <span className="text-xl">✅</span>
            <span>Lesson Completed!</span>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            className="btn-primary flex items-center gap-2 group"
          >
            <span>Mark as Complete</span>
            <span className="group-hover:scale-110 transition-transform">🎯</span>
          </button>
        )}

        {nextLessonSlug && isCompleted && (
          <a
            href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
            className="btn-secondary flex items-center gap-2 group"
          >
            <span>Next Lesson</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
      </div>
    </>
  )
}

// Export utility to check if a lesson is completed
export function isLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const lessonKey = `${courseSlug}/${lessonSlug}`
  return getCompletedLessons().includes(lessonKey)
}

// Export utility to get all completed lessons for a course
export function getCompletedLessonsForCourse(courseSlug: string): string[] {
  const completed = getCompletedLessons()
  return completed
    .filter(key => key.startsWith(`${courseSlug}/`))
    .map(key => key.replace(`${courseSlug}/`, ''))
}