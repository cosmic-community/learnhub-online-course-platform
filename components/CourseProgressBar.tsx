'use client'

import { useEffect, useState } from 'react'
import { loadProgress, getCourseProgress, type UserProgress } from '@/lib/progress'

interface CourseProgressBarProps {
  courseSlug: string
  lessonIds: string[]
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CourseProgressBar({ 
  courseSlug, 
  lessonIds, 
  showLabel = true,
  size = 'md' 
}: CourseProgressBarProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
    
    // Listen for progress updates
    const handleStorageChange = () => {
      setProgress(loadProgress())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!progress || lessonIds.length === 0) {
    return null
  }

  const courseProgress = getCourseProgress(progress, courseSlug, lessonIds)
  
  if (courseProgress.completed === 0) {
    return null
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  const isComplete = courseProgress.percentage === 100

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-navy-400">Your progress</span>
          <span className={`text-sm font-medium ${
            isComplete ? 'text-green-400' : 'text-primary-400'
          }`}>
            {courseProgress.completed}/{courseProgress.total} lessons ({courseProgress.percentage}%)
          </span>
        </div>
      )}
      
      <div className={`w-full ${heightClass} bg-navy-700 rounded-full overflow-hidden`}>
        <div 
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
              : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${courseProgress.percentage}%` }}
        />
      </div>
      
      {isComplete && showLabel && (
        <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
          <span>🎉</span> Course completed!
        </p>
      )}
    </div>
  )
}