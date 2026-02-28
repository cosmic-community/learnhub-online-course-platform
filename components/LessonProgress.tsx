'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Lesson {
  slug: string
  title: string
  metadata?: {
    title?: string
    duration_minutes?: number
  }
}

interface LessonProgressProps {
  courseSlug: string
  lessons: Lesson[]
  currentLessonSlug: string
}

export default function LessonProgress({ courseSlug, lessons, currentLessonSlug }: LessonProgressProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const storageKey = `learnhub-progress-${courseSlug}`

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved))
      } catch {
        setCompletedLessons([])
      }
    }
  }, [storageKey])

  if (!mounted) return null

  return (
    <div className="space-y-1">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.slug)
        const isCurrent = lesson.slug === currentLessonSlug
        
        return (
          <Link
            key={lesson.slug}
            href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isCurrent
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-navy-300 hover:bg-navy-800/50 hover:text-white'
            }`}
          >
            {/* Status indicator */}
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              isCompleted
                ? 'bg-green-500/20 text-green-400'
                : isCurrent
                ? 'bg-primary-500 text-white'
                : 'bg-navy-800 text-navy-500'
            }`}>
              {isCompleted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </span>

            {/* Lesson info */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${isCurrent ? 'text-primary-400' : ''}`}>
                {lesson.metadata?.title || lesson.title}
              </div>
              {lesson.metadata?.duration_minutes && (
                <div className="text-xs text-navy-500">
                  {lesson.metadata.duration_minutes} min
                </div>
              )}
            </div>

            {/* Play icon for current */}
            {isCurrent && (
              <span className="text-primary-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}