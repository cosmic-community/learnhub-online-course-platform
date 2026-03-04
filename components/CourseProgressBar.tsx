'use client'

import { useState, useEffect } from 'react'
import { getCourseProgress, getCompletionPercentage } from '@/lib/progress'
import ProgressRing from './ProgressRing'

interface CourseProgressBarProps {
  courseSlug: string
  totalLessons: number
  className?: string
}

export default function CourseProgressBar({
  courseSlug,
  totalLessons,
  className = '',
}: CourseProgressBarProps) {
  const [progress, setProgress] = useState<{
    completed: number
    percentage: number
  } | null>(null)

  useEffect(() => {
    const courseProgress = getCourseProgress(courseSlug)
    if (courseProgress) {
      setProgress({
        completed: courseProgress.completedLessons.length,
        percentage: getCompletionPercentage(courseProgress),
      })
    } else {
      setProgress({ completed: 0, percentage: 0 })
    }
  }, [courseSlug])

  // Listen for storage changes (from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const courseProgress = getCourseProgress(courseSlug)
      if (courseProgress) {
        setProgress({
          completed: courseProgress.completedLessons.length,
          percentage: getCompletionPercentage(courseProgress),
        })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [courseSlug])

  if (!progress || progress.completed === 0) {
    return null
  }

  const isComplete = progress.percentage === 100

  return (
    <div className={`bg-navy-800/50 rounded-xl p-4 border border-navy-700 ${className}`}>
      <div className="flex items-center gap-4">
        <ProgressRing progress={progress.percentage} size={50} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-white">
              {isComplete ? '🎉 Course Complete!' : 'Your Progress'}
            </span>
            <span className="text-xs text-navy-400">
              {progress.completed} of {totalLessons} lessons
            </span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                  : 'bg-gradient-to-r from-primary-500 to-primary-400'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}