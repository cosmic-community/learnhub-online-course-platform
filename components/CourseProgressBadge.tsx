'use client'

import { useState, useEffect } from 'react'
import { getCourseProgress } from '@/lib/progress'
import ProgressBar from './ProgressBar'

interface CourseProgressBadgeProps {
  courseId: string
  totalLessons: number
  showBar?: boolean
  className?: string
}

export default function CourseProgressBadge({
  courseId,
  totalLessons,
  showBar = true,
  className = '',
}: CourseProgressBadgeProps) {
  const [progress, setProgress] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const courseProgress = getCourseProgress(courseId)
    if (courseProgress) {
      const percentage = totalLessons > 0 
        ? (courseProgress.completedLessons / totalLessons) * 100 
        : 0
      setProgress(percentage)
    }
    setIsLoading(false)
  }, [courseId, totalLessons])

  // Don't show anything if no progress or still loading
  if (isLoading || progress === null || progress === 0) {
    return null
  }

  const isComplete = progress >= 100

  if (!showBar) {
    return (
      <span className={`badge ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-primary-500/20 text-primary-400'} ${className}`}>
        {isComplete ? '✓ Completed' : `${Math.round(progress)}%`}
      </span>
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <ProgressBar progress={progress} size="sm" />
      <div className="text-xs text-navy-400">
        {isComplete ? (
          <span className="text-green-400">✓ Course completed!</span>
        ) : (
          `${Math.round(progress)}% complete`
        )}
      </div>
    </div>
  )
}