'use client'

import { useState, useEffect } from 'react'

interface ProgressTrackerProps {
  courseSlug: string
  lessonSlugs: string[]
  currentLessonSlug?: string
}

export default function ProgressTracker({ 
  courseSlug, 
  lessonSlugs, 
  currentLessonSlug 
}: ProgressTrackerProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        setCompletedLessons(JSON.parse(stored))
      } catch {
        setCompletedLessons([])
      }
    }
    setIsLoaded(true)
  }, [storageKey])

  const toggleLesson = (lessonSlug: string) => {
    const newCompleted = completedLessons.includes(lessonSlug)
      ? completedLessons.filter(s => s !== lessonSlug)
      : [...completedLessons, lessonSlug]
    
    setCompletedLessons(newCompleted)
    localStorage.setItem(storageKey, JSON.stringify(newCompleted))
  }

  const markCurrentComplete = () => {
    if (currentLessonSlug && !completedLessons.includes(currentLessonSlug)) {
      const newCompleted = [...completedLessons, currentLessonSlug]
      setCompletedLessons(newCompleted)
      localStorage.setItem(storageKey, JSON.stringify(newCompleted))
    }
  }

  const progressPercentage = lessonSlugs.length > 0 
    ? Math.round((completedLessons.length / lessonSlugs.length) * 100)
    : 0

  if (!isLoaded) {
    return (
      <div className="animate-pulse bg-navy-800 rounded-lg h-20" />
    )
  }

  return (
    <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-xl">📊</span>
          Your Progress
        </h4>
        <span className="text-primary-400 font-bold text-lg">
          {progressPercentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 bg-navy-800 rounded-full overflow-hidden mb-3">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
        {progressPercentage === 100 && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 animate-pulse" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-navy-400">
          {completedLessons.length} of {lessonSlugs.length} lessons completed
        </span>
        {progressPercentage === 100 && (
          <span className="text-green-400 flex items-center gap-1">
            <span>🎉</span> Course Complete!
          </span>
        )}
      </div>

      {/* Mark Complete Button for current lesson */}
      {currentLessonSlug && !completedLessons.includes(currentLessonSlug) && (
        <button
          onClick={markCurrentComplete}
          className="mt-4 w-full btn-primary text-sm py-2 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark Lesson Complete
        </button>
      )}

      {currentLessonSlug && completedLessons.includes(currentLessonSlug) && (
        <button
          onClick={() => toggleLesson(currentLessonSlug)}
          className="mt-4 w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 text-green-400"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Completed ✓
        </button>
      )}
    </div>
  )
}