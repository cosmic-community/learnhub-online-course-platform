'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Lesson } from '@/types'

interface LessonListProps {
  lessons: Lesson[]
  courseSlug: string
  currentLessonSlug?: string
}

interface CompletedLessons {
  [key: string]: boolean
}

export default function LessonList({ lessons, courseSlug, currentLessonSlug }: LessonListProps) {
  const [completedLessons, setCompletedLessons] = useState<CompletedLessons>({})

  useEffect(() => {
    const updateCompleted = () => {
      const stored = localStorage.getItem('learnhub-completed-lessons')
      if (stored) {
        setCompletedLessons(JSON.parse(stored))
      }
    }

    updateCompleted()

    window.addEventListener('lesson-completed', updateCompleted)
    return () => window.removeEventListener('lesson-completed', updateCompleted)
  }, [])

  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isActive = lesson.slug === currentLessonSlug
        const isCompleted = completedLessons[`${courseSlug}/${lesson.slug}`]
        
        return (
          <Link
            key={lesson.id}
            href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
            className={`block p-3 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-primary-500/20 border border-primary-500/30'
                : isCompleted
                ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
                : 'bg-navy-800/50 hover:bg-navy-800 border border-transparent'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted
                  ? 'bg-green-500/20 text-green-400'
                  : isActive
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-navy-700 text-navy-400'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${
                  isActive ? 'text-primary-400' : isCompleted ? 'text-green-400' : 'text-white'
                }`}>
                  {lesson.metadata?.title || lesson.title}
                </h4>
                {lesson.metadata?.duration_minutes && (
                  <span className="text-sm text-navy-500">
                    {lesson.metadata.duration_minutes} min
                  </span>
                )}
              </div>
              {isActive && (
                <span className="flex-shrink-0 text-primary-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}