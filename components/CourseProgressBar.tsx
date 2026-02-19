'use client'

import { useEffect, useState } from 'react'
import { getCourseProgressPercent, loadProgress } from '@/lib/progress'

interface CourseProgressBarProps {
  courseSlug: string
  totalLessons: number
  showDetails?: boolean
}

export default function CourseProgressBar({
  courseSlug,
  totalLessons,
  showDetails = false,
}: CourseProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const percent = getCourseProgressPercent(courseSlug, totalLessons)
    setProgress(percent)
    
    const progressData = loadProgress()
    const courseProgress = progressData.courses[courseSlug]
    setCompletedCount(courseProgress?.completedLessons.length ?? 0)
  }, [courseSlug, totalLessons])
  
  if (!mounted || progress === 0) {
    return null
  }
  
  return (
    <div className="space-y-2">
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-navy-400">
            {completedCount} of {totalLessons} lessons completed
          </span>
          <span className="font-semibold text-primary-400">{progress}%</span>
        </div>
      )}
      
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {progress === 100 && (
        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
          <span>✓</span>
          <span>Course Completed!</span>
          <span>🎉</span>
        </div>
      )}
    </div>
  )
}