'use client'

import { useEffect, useState } from 'react'
import { getProgressPercentage, getCourseProgress } from '@/lib/progress'

interface ProgressBarProps {
  courseId: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ProgressBar({ courseId, showPercentage = true, size = 'md' }: ProgressBarProps) {
  const [percentage, setPercentage] = useState(0)
  const [lessonsCount, setLessonsCount] = useState({ completed: 0, total: 0 })

  useEffect(() => {
    const updateProgress = () => {
      const progress = getCourseProgress(courseId)
      if (progress) {
        setPercentage(getProgressPercentage(courseId))
        setLessonsCount({
          completed: progress.completedLessons.length,
          total: progress.totalLessons,
        })
      }
    }

    updateProgress()

    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', updateProgress)
    // Custom event for same-tab updates
    window.addEventListener('progressUpdate', updateProgress)

    return () => {
      window.removeEventListener('storage', updateProgress)
      window.removeEventListener('progressUpdate', updateProgress)
    }
  }, [courseId])

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  if (lessonsCount.total === 0) return null

  return (
    <div className="w-full">
      <div className={`w-full bg-navy-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-400 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-navy-400">
            {lessonsCount.completed} of {lessonsCount.total} lessons
          </span>
          <span className="text-xs font-medium text-primary-400">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  )
}