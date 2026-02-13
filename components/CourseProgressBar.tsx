'use client'

import { useState, useEffect } from 'react'

interface CourseProgressBarProps {
  courseSlug: string
  lessons: Array<{ slug: string }>
}

interface CompletedLessons {
  [key: string]: boolean
}

export default function CourseProgressBar({ courseSlug, lessons }: CourseProgressBarProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      const stored = localStorage.getItem('learnhub-completed-lessons')
      if (stored) {
        const completedLessons: CompletedLessons = JSON.parse(stored)
        const count = lessons.filter(lesson => 
          completedLessons[`${courseSlug}/${lesson.slug}`]
        ).length
        setCompletedCount(count)
      }
    }

    updateProgress()

    // Listen for lesson completion events
    const handleLessonComplete = () => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
      updateProgress()
    }

    window.addEventListener('lesson-completed', handleLessonComplete)
    return () => window.removeEventListener('lesson-completed', handleLessonComplete)
  }, [courseSlug, lessons])

  const totalLessons = lessons.length
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0
  const isComplete = completedCount === totalLessons && totalLessons > 0

  return (
    <div className={`p-4 bg-navy-900/50 border rounded-xl transition-all duration-300 ${
      isComplete ? 'border-green-500/50 bg-green-500/5' : 'border-navy-800'
    } ${isAnimating ? 'scale-[1.02]' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-navy-300">
          {isComplete ? '🎉 Course Completed!' : 'Your Progress'}
        </span>
        <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-primary-400'}`}>
          {completedCount}/{totalLessons} lessons
        </span>
      </div>
      
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
              : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {progressPercentage > 0 && progressPercentage < 100 && (
        <p className="mt-2 text-xs text-navy-500">
          {Math.round(progressPercentage)}% complete • {totalLessons - completedCount} lessons remaining
        </p>
      )}

      {isComplete && (
        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Congratulations! You've mastered this course!
        </div>
      )}
    </div>
  )
}