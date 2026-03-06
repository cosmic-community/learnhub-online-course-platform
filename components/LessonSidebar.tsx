'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Lesson } from '@/types'

interface LessonSidebarProps {
  courseSlug: string
  lessons: Lesson[]
  currentLessonSlug: string
}

export default function LessonSidebar({ courseSlug, lessons, currentLessonSlug }: LessonSidebarProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    const storageKey = `learnhub-progress-${courseSlug}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch {
        setCompletedLessons([])
      }
    }

    // Listen for storage changes (when progress is updated)
    const handleStorageChange = () => {
      const updated = localStorage.getItem(storageKey)
      if (updated) {
        try {
          setCompletedLessons(JSON.parse(updated))
        } catch {
          setCompletedLessons([])
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      const updated = localStorage.getItem(storageKey)
      if (updated) {
        try {
          const parsed = JSON.parse(updated)
          setCompletedLessons(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
              return parsed
            }
            return prev
          })
        } catch {
          // ignore
        }
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [courseSlug])

  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  return (
    <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>📚</span>
        Course Lessons
      </h3>
      <nav className="space-y-2">
        {sortedLessons.map((lesson, index) => {
          const isActive = lesson.slug === currentLessonSlug
          const isCompleted = completedLessons.includes(lesson.slug)
          
          return (
            <Link
              key={lesson.id}
              href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500/20 border border-primary-500/30'
                  : 'hover:bg-navy-800/50 border border-transparent'
              }`}
            >
              {/* Lesson Number / Completion Status */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                isCompleted
                  ? 'bg-green-500/20 text-green-400'
                  : isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-navy-700 text-navy-300 group-hover:bg-navy-600'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isActive ? 'text-primary-400' : 'text-white group-hover:text-primary-400'
                }`}>
                  {lesson.metadata?.title || lesson.title}
                </p>
                {lesson.metadata?.duration_minutes && (
                  <p className="text-xs text-navy-500 mt-0.5">
                    {lesson.metadata.duration_minutes} min
                  </p>
                )}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}