'use client'

import { useState, useEffect } from 'react'
import { getCourseProgress, calculateProgressPercentage } from '@/lib/progress'
import ProgressBar from './ProgressBar'

interface CourseProgressIndicatorProps {
  courseSlug: string
  totalLessons: number
  showLabel?: boolean
  className?: string
}

export default function CourseProgressIndicator({
  courseSlug,
  totalLessons,
  showLabel = false,
  className = ''
}: CourseProgressIndicatorProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const progress = getCourseProgress(courseSlug)
    setCompletedCount(progress?.completedLessons.length ?? 0)
  }, [courseSlug])

  // Don't render on server or if no progress
  if (!mounted || completedCount === 0) return null

  const percentage = calculateProgressPercentage(completedCount, totalLessons)

  return (
    <div className={className}>
      <ProgressBar percentage={percentage} showLabel={showLabel} size="small" />
      {showLabel && (
        <p className="text-xs text-navy-400 mt-1">
          {completedCount} of {totalLessons} lessons completed
        </p>
      )}
    </div>
  )
}