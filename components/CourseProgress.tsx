'use client'

import { useState, useEffect } from 'react'

interface Lesson {
  slug: string
  title?: string
  metadata?: {
    title?: string
  }
}

interface CourseProgressProps {
  courseSlug: string
  lessons: Lesson[]
}

export default function CourseProgress({ courseSlug, lessons }: CourseProgressProps) {
  const [completedCount, setCompletedCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let count = 0
    lessons.forEach((lesson) => {
      const key = `lesson-${courseSlug}-${lesson.slug}`
      if (localStorage.getItem(key)) {
        count++
      }
    })
    setCompletedCount(count)
    setIsLoaded(true)
  }, [courseSlug, lessons])

  if (!isLoaded || lessons.length === 0) return null

  const percentage = Math.round((completedCount / lessons.length) * 100)
  const isComplete = completedCount === lessons.length

  return (
    <div className="p-4 rounded-xl bg-navy-900/50 border border-navy-800">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-navy-300">Your Progress</span>
        <span className={`text-sm font-bold ${isComplete ? 'text-green-400' : 'text-primary-400'}`}>
          {percentage}%
        </span>
      </div>
      
      <div className="relative h-2 bg-navy-800 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-3 flex items-center justify-between text-xs text-navy-400">
        <span>{completedCount} of {lessons.length} lessons completed</span>
        {isComplete && (
          <span className="flex items-center gap-1 text-green-400 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Course Complete!
          </span>
        )}
      </div>
    </div>
  )
}