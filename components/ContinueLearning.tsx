'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface ContinueLearningProps {
  courses: Course[]
}

interface LearningProgress {
  courseSlug: string
  lastLessonSlug: string
  completedLessons: number
  totalLessons: number
  lastAccessedAt: string
}

const PROGRESS_KEY = 'learnhub-learning-progress'
const COMPLETED_LESSONS_KEY = 'learnhub-completed-lessons'

function getProgress(): LearningProgress[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(COMPLETED_LESSONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [progressData, setProgressData] = useState<LearningProgress[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Build progress from completed lessons
    const completedLessons = getCompletedLessons()
    const progressMap = new Map<string, { completed: string[], lastAccessed: string }>()

    completedLessons.forEach(lessonKey => {
      const [courseSlug] = lessonKey.split('/')
      if (courseSlug) {
        const existing = progressMap.get(courseSlug) || { completed: [], lastAccessed: new Date().toISOString() }
        existing.completed.push(lessonKey)
        progressMap.set(courseSlug, existing)
      }
    })

    // Match with actual courses and build progress
    const progress: LearningProgress[] = []
    
    courses.forEach(course => {
      const courseProgress = progressMap.get(course.slug)
      if (courseProgress && courseProgress.completed.length > 0) {
        const totalLessons = course.metadata?.lessons?.length ?? 0
        const completedCount = courseProgress.completed.length
        
        // Find next lesson to continue
        const lessons = course.metadata?.lessons ?? []
        const sortedLessons = [...lessons].sort((a, b) => {
          const orderA = a.metadata?.order ?? 999
          const orderB = b.metadata?.order ?? 999
          return orderA - orderB
        })
        
        // Find first uncompleted lesson
        let nextLessonSlug = sortedLessons[0]?.slug ?? ''
        for (const lesson of sortedLessons) {
          const lessonKey = `${course.slug}/${lesson.slug}`
          if (!completedLessons.includes(lessonKey)) {
            nextLessonSlug = lesson.slug
            break
          }
        }
        
        // Only show if not fully completed
        if (completedCount < totalLessons) {
          progress.push({
            courseSlug: course.slug,
            lastLessonSlug: nextLessonSlug,
            completedLessons: completedCount,
            totalLessons,
            lastAccessedAt: courseProgress.lastAccessed,
          })
        }
      }
    })

    // Sort by last accessed
    progress.sort((a, b) => 
      new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    )

    setProgressData(progress.slice(0, 3)) // Show max 3 courses
    setIsLoaded(true)
  }, [courses])

  if (!isLoaded || progressData.length === 0) return null

  // Find full course data for each progress item
  const coursesInProgress = progressData.map(progress => {
    const course = courses.find(c => c.slug === progress.courseSlug)
    return course ? { course, progress } : null
  }).filter((item): item is { course: Course; progress: LearningProgress } => item !== null)

  if (coursesInProgress.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">📖</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
            <p className="text-navy-400 text-sm">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesInProgress.map(({ course, progress }) => {
            const percentComplete = Math.round((progress.completedLessons / progress.totalLessons) * 100)
            const thumbnail = course.metadata?.thumbnail?.imgix_url
            
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}/lessons/${progress.lastLessonSlug}`}
                className="card group block overflow-hidden hover:ring-2 hover:ring-primary-500/50 transition-all"
              >
                {/* Thumbnail with overlay */}
                <div className="relative h-32 bg-navy-800 overflow-hidden">
                  {thumbnail && (
                    <img
                      src={`${thumbnail}?w=600&h=256&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title ?? course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary-500/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {course.metadata?.title ?? course.title}
                  </h3>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-navy-400 mb-1">
                      <span>{progress.completedLessons} of {progress.totalLessons} lessons</span>
                      <span>{percentComplete}%</span>
                    </div>
                    <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentComplete}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-sm text-primary-400 font-medium group-hover:underline">
                    Continue →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}