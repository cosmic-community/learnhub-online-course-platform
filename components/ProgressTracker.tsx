'use client'

import { useState, useEffect } from 'react'

interface ProgressTrackerProps {
  courseSlug: string
  lessonSlugs: string[]
  currentLessonSlug?: string
}

export default function ProgressTracker({ courseSlug, lessonSlugs, currentLessonSlug }: ProgressTrackerProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch {
        setCompletedLessons([])
      }
    }
  }, [storageKey])

  const toggleLesson = (lessonSlug: string) => {
    setCompletedLessons(prev => {
      const newCompleted = prev.includes(lessonSlug)
        ? prev.filter(s => s !== lessonSlug)
        : [...prev, lessonSlug]
      
      localStorage.setItem(storageKey, JSON.stringify(newCompleted))
      return newCompleted
    })
  }

  const markCurrentComplete = () => {
    if (currentLessonSlug && !completedLessons.includes(currentLessonSlug)) {
      toggleLesson(currentLessonSlug)
    }
  }

  if (!mounted) return null

  const progress = lessonSlugs.length > 0 
    ? Math.round((completedLessons.length / lessonSlugs.length) * 100)
    : 0

  const isCurrentComplete = currentLessonSlug ? completedLessons.includes(currentLessonSlug) : false

  return (
    <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>📊</span> Your Progress
        </h3>
        <span className="text-primary-400 font-bold">{progress}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-navy-400 mb-4">
        <span>{completedLessons.length} of {lessonSlugs.length} lessons completed</span>
        {progress === 100 && (
          <span className="text-green-400 flex items-center gap-1">
            <span>🎉</span> Complete!
          </span>
        )}
      </div>

      {/* Mark Complete Button (if on a lesson page) */}
      {currentLessonSlug && (
        <button
          onClick={isCurrentComplete ? () => toggleLesson(currentLessonSlug) : markCurrentComplete}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isCurrentComplete
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {isCurrentComplete ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed! (Click to undo)
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
      )}
    </div>
  )
}