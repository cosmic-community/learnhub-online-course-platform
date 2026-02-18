'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCourseProgress } from '@/lib/progress'
import type { Lesson } from '@/types'

interface LessonListProps {
  lessons: Lesson[]
  courseSlug: string
  currentLessonSlug?: string
}

export default function LessonList({ lessons, courseSlug, currentLessonSlug }: LessonListProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const progress = getCourseProgress(courseSlug)
    setCompletedLessons(progress?.completedLessons ?? [])
  }, [courseSlug])

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  return (
    <div className="space-y-2">
      {sortedLessons.map((lesson, index) => {
        const isActive = lesson.slug === currentLessonSlug
        const isCompleted = mounted && completedLessons.includes(lesson.slug)
        
        return (
          <Link
            key={lesson.id}
            href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
            className={`
              block p-4 rounded-lg border transition-all duration-200
              ${isActive 
                ? 'bg-primary-500/10 border-primary-500/50 text-white' 
                : 'bg-navy-900/50 border-navy-800 text-navy-300 hover:border-navy-700 hover:text-white'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Lesson Number / Completion Status */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isCompleted 
                  ? 'bg-primary-500 text-white' 
                  : isActive 
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' 
                    : 'bg-navy-800 text-navy-400'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm truncate ${isActive ? 'text-white' : ''}`}>
                  {lesson.metadata?.title || lesson.title}
                </h4>
                {lesson.metadata?.duration_minutes && (
                  <p className="text-xs text-navy-500 mt-1">
                    {lesson.metadata.duration_minutes} min
                  </p>
                )}
              </div>
              
              {/* Play icon for active lesson */}
              {isActive && (
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}