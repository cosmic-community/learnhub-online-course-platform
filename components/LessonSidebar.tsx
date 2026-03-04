'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { isLessonCompleted } from '@/lib/progress'
import type { Course, Lesson } from '@/types'

interface LessonSidebarProps {
  course: Course
  currentLessonSlug: string
}

export default function LessonSidebar({ course, currentLessonSlug }: LessonSidebarProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  const lessons = course.metadata?.lessons || []
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  useEffect(() => {
    // Check completion status for all lessons
    const completed = new Set<string>()
    sortedLessons.forEach((lesson) => {
      if (isLessonCompleted(course.slug, lesson.slug)) {
        completed.add(lesson.slug)
      }
    })
    setCompletedLessons(completed)
  }, [course.slug, sortedLessons])

  // Listen for progress changes
  useEffect(() => {
    const handleProgressChange = () => {
      const completed = new Set<string>()
      sortedLessons.forEach((lesson) => {
        if (isLessonCompleted(course.slug, lesson.slug)) {
          completed.add(lesson.slug)
        }
      })
      setCompletedLessons(completed)
    }

    // Custom event for same-tab updates
    window.addEventListener('progressUpdate', handleProgressChange)
    return () => window.removeEventListener('progressUpdate', handleProgressChange)
  }, [course.slug, sortedLessons])

  const completionCount = completedLessons.size
  const totalLessons = sortedLessons.length
  const completionPercentage = totalLessons > 0 ? Math.round((completionCount / totalLessons) * 100) : 0

  return (
    <div className="bg-navy-900/50 border border-navy-800 rounded-2xl overflow-hidden">
      {/* Course Header */}
      <div className="p-4 border-b border-navy-800">
        <Link
          href={`/courses/${course.slug}`}
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Course
        </Link>
        <h3 className="font-semibold text-white mt-2 line-clamp-2">
          {course.metadata?.title || course.title}
        </h3>
        
        {/* Progress indicator */}
        {completionCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-navy-400 mb-1">
              <span>{completionCount} of {totalLessons} complete</span>
              <span className={completionPercentage === 100 ? 'text-green-400' : ''}>
                {completionPercentage}%
              </span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completionPercentage === 100
                    ? 'bg-green-500'
                    : 'bg-primary-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div className="max-h-96 overflow-y-auto">
        {sortedLessons.map((lesson: Lesson, index: number) => {
          const isActive = lesson.slug === currentLessonSlug
          const isComplete = completedLessons.has(lesson.slug)

          return (
            <Link
              key={lesson.id}
              href={`/courses/${course.slug}/lessons/${lesson.slug}`}
              className={`flex items-start gap-3 p-3 border-b border-navy-800/50 hover:bg-navy-800/30 transition-colors ${
                isActive ? 'bg-navy-800/50' : ''
              }`}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {isComplete ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs text-navy-400">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Lesson info */}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium line-clamp-2 ${
                    isActive
                      ? 'text-primary-400'
                      : isComplete
                      ? 'text-green-400'
                      : 'text-white'
                  }`}
                >
                  {lesson.metadata?.title || lesson.title}
                </span>
                {lesson.metadata?.duration_minutes && (
                  <span className="text-xs text-navy-500">
                    {lesson.metadata.duration_minutes} min
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}