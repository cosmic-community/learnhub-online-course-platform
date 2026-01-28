'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Lesson } from '@/types'
import { isLessonCompleted } from '@/lib/progress'

interface LessonListProps {
  lessons: Lesson[]
  courseSlug: string
  currentLessonSlug?: string
}

export default function LessonList({ lessons, courseSlug, currentLessonSlug }: LessonListProps) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Check completion status for all lessons
    const completed = new Set<string>()
    lessons.forEach((lesson) => {
      if (isLessonCompleted(courseSlug, lesson.slug)) {
        completed.add(lesson.slug)
      }
    })
    setCompletedLessons(completed)
  }, [lessons, courseSlug])
  
  // Calculate total duration
  const totalMinutes = lessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  // Calculate progress
  const progressPercent = mounted && lessons.length > 0 
    ? Math.round((completedLessons.size / lessons.length) * 100)
    : 0

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-navy-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white">Course Content</h3>
          {mounted && progressPercent > 0 && (
            <span className="text-xs font-medium text-primary-400">
              {progressPercent}% complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-navy-400">
          <span>{lessons.length} lessons</span>
          {totalMinutes > 0 && (
            <span>
              {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}m` : ''}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {mounted && progressPercent > 0 && (
          <div className="mt-3 h-1.5 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
      <div className="divide-y divide-navy-800 max-h-[500px] overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.slug === currentLessonSlug
          const isCompleted = mounted && completedLessons.has(lesson.slug)
          
          return (
            <Link
              key={lesson.id}
              href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
              className={`flex items-start gap-3 p-4 transition-colors ${
                isCurrent
                  ? 'bg-primary-500/10 border-l-2 border-primary-500'
                  : 'hover:bg-navy-800/50'
              }`}
            >
              {/* Lesson number or completion check */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted
                  ? 'bg-primary-500 text-white'
                  : isCurrent
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500'
                    : 'bg-navy-800 text-navy-400'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium leading-tight ${
                  isCurrent ? 'text-primary-400' : isCompleted ? 'text-navy-300' : 'text-white'
                }`}>
                  {lesson.metadata?.title || lesson.title}
                </h4>
                {lesson.metadata?.duration_minutes && (
                  <p className="text-xs text-navy-500 mt-1">
                    {lesson.metadata.duration_minutes} min
                  </p>
                )}
              </div>
              
              {isCurrent && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-500/20 text-primary-400">
                    Current
                  </span>
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}