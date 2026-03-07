'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCourseProgress } from '@/lib/progress'
import type { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
  courseSlug: string
  index: number
}

export default function LessonCard({ lesson, courseSlug, index }: LessonCardProps) {
  const [isComplete, setIsComplete] = useState(false)
  const { metadata } = lesson

  useEffect(() => {
    const progress = getCourseProgress(courseSlug)
    if (progress) {
      setIsComplete(progress.completedLessons.includes(lesson.slug))
    }
  }, [courseSlug, lesson.slug])

  return (
    <Link
      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-all group"
    >
      {/* Lesson Number / Completion Status */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all
        ${isComplete 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-navy-700 text-navy-300 group-hover:bg-primary-500/20 group-hover:text-primary-400'
        }
      `}>
        {isComplete ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          index
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium transition-colors truncate ${
          isComplete ? 'text-green-400' : 'text-white group-hover:text-primary-400'
        }`}>
          {metadata?.title || lesson.title}
        </h3>
        {metadata?.description && (
          <p className="text-sm text-navy-400 truncate mt-1">
            {metadata.description}
          </p>
        )}
      </div>

      {/* Duration */}
      {metadata?.duration_minutes && (
        <div className="text-sm text-navy-500 flex-shrink-0">
          {metadata.duration_minutes} min
        </div>
      )}

      {/* Arrow */}
      <svg 
        className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-all group-hover:translate-x-1 flex-shrink-0" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}