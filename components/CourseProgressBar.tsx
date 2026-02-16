'use client'

import { useState, useEffect } from 'react'

interface CourseProgressBarProps {
  courseSlug: string
  totalLessons: number
}

export default function CourseProgressBar({ courseSlug, totalLessons }: CourseProgressBarProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storageKey = `learnhub-progress-${courseSlug}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        setCompletedCount(parsed.length)
      }
    }
  }, [courseSlug])

  // Listen for storage changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = () => {
      const storageKey = `learnhub-progress-${courseSlug}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        setCompletedCount(parsed.length)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [courseSlug])

  if (!mounted || totalLessons === 0) return null

  const percentage = Math.round((completedCount / totalLessons) * 100)
  const isComplete = completedCount === totalLessons

  if (completedCount === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-navy-900/80 rounded-lg border border-navy-800">
      <div className="flex items-center gap-2">
        {isComplete ? (
          <span className="text-lg">🏆</span>
        ) : (
          <span className="text-lg">📊</span>
        )}
        <span className="text-sm font-medium text-navy-300">
          {isComplete ? 'Completed!' : `${percentage}% Progress`}
        </span>
      </div>
      <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden min-w-[60px]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-400' 
              : 'bg-gradient-to-r from-primary-500 to-primary-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-navy-500">
        {completedCount}/{totalLessons}
      </span>
    </div>
  )
}