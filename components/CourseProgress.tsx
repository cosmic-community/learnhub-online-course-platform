'use client'

import { useState, useEffect } from 'react'

interface CourseProgressProps {
  courseSlug: string
  totalLessons: number
  lessonSlugs: string[]
}

export default function CourseProgress({ courseSlug, totalLessons, lessonSlugs }: CourseProgressProps) {
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
      const courseCompletedLessons = lessonSlugs.filter(slug => 
        completedLessons.includes(`${courseSlug}/${slug}`)
      )
      setCompletedCount(courseCompletedLessons.length)
    }

    updateProgress()
    
    // Listen for storage changes
    window.addEventListener('storage', updateProgress)
    
    // Also check periodically for same-tab updates
    const interval = setInterval(updateProgress, 1000)
    
    return () => {
      window.removeEventListener('storage', updateProgress)
      clearInterval(interval)
    }
  }, [courseSlug, lessonSlugs])

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const isComplete = percentage === 100

  if (totalLessons === 0) return null

  return (
    <div className="bg-navy-800/50 rounded-lg p-4 border border-navy-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-navy-300">Your Progress</span>
        <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-primary-400'}`}>
          {completedCount}/{totalLessons} lessons
        </span>
      </div>
      
      <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
              : 'bg-gradient-to-r from-primary-500 to-purple-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-center">
        {isComplete ? (
          <span className="text-green-400 text-sm font-medium flex items-center justify-center gap-2">
            <span className="text-lg">🎉</span>
            Course Complete! You&apos;re amazing!
          </span>
        ) : (
          <span className="text-navy-400 text-xs">
            {percentage}% complete - Keep learning!
          </span>
        )}
      </div>
    </div>
  )
}