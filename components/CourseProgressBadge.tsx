'use client'

import { useState, useEffect } from 'react'
import { getProgressPercentage } from '@/lib/progress'
import ProgressRing from './ProgressRing'

interface CourseProgressBadgeProps {
  courseSlug: string
}

export default function CourseProgressBadge({ courseSlug }: CourseProgressBadgeProps) {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setProgress(getProgressPercentage(courseSlug))
  }, [courseSlug])
  
  if (!mounted || progress === 0) {
    return null
  }
  
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-navy-900/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
        <ProgressRing progress={progress} size={44} strokeWidth={3} />
      </div>
    </div>
  )
}