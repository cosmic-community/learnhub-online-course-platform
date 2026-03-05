'use client'

import { useEffect, useState } from 'react'
import ProgressRing from './ProgressRing'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseProgressCardProps {
  course: Course
}

interface CourseProgress {
  completedLessons: string[]
  lastAccessed: string
}

const PROGRESS_KEY = 'learnhub_course_progress'

function getProgress(courseSlug: string): CourseProgress {
  if (typeof window === 'undefined') {
    return { completedLessons: [], lastAccessed: '' }
  }
  
  try {
    const stored = localStorage.getItem(`${PROGRESS_KEY}_${courseSlug}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  
  return { completedLessons: [], lastAccessed: '' }
}

export default function CourseProgressCard({ course }: CourseProgressCardProps) {
  const [progress, setProgress] = useState<CourseProgress>({
    completedLessons: [],
    lastAccessed: ''
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getProgress(course.slug)
    setProgress(stored)
    setIsLoaded(true)
  }, [course.slug])

  const totalLessons = course.metadata?.lessons?.length ?? 0
  const completedCount = progress.completedLessons.length
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
  const hasStarted = completedCount > 0

  // Find next lesson to continue
  const nextLesson = course.metadata?.lessons?.find(
    lesson => !progress.completedLessons.includes(lesson.slug)
  )

  if (!isLoaded || !hasStarted) return null

  return (
    <div className="card p-6">
      <div className="flex items-center gap-6">
        {/* Progress Ring */}
        <ProgressRing progress={progressPercent} size={100} strokeWidth={6} />
        
        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <Link 
            href={`/courses/${course.slug}`}
            className="text-lg font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1"
          >
            {course.metadata?.title || course.title}
          </Link>
          
          <div className="text-sm text-navy-400 mt-1">
            {completedCount} of {totalLessons} lessons completed
          </div>

          {/* Continue Button */}
          {nextLesson ? (
            <Link
              href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue Learning
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Course Complete! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}