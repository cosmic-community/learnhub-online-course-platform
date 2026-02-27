'use client'

import { useState, useEffect } from 'react'
import { getCourseProgressPercent } from '@/lib/progress'
import ProgressBar from './ProgressBar'

interface CourseProgressBadgeProps {
  courseId: string
  compact?: boolean
}

export default function CourseProgressBadge({ courseId, compact = false }: CourseProgressBadgeProps) {
  const [percent, setPercent] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPercent(getCourseProgressPercent(courseId))
    
    // Listen for storage changes (in case user completes lesson in another tab)
    const handleStorage = () => {
      setPercent(getCourseProgressPercent(courseId))
    }
    
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [courseId])

  if (!mounted || percent === 0) {
    return null
  }

  if (compact) {
    return (
      <div className="absolute top-3 left-3 bg-navy-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
        <div className="w-16">
          <ProgressBar percent={percent} size="sm" showLabel={false} />
        </div>
        <span className="text-xs font-medium text-primary-400">{percent}%</span>
      </div>
    )
  }

  return (
    <div className="mt-3">
      <ProgressBar percent={percent} size="sm" />
    </div>
  )
}