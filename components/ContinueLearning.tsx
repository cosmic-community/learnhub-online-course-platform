'use client'

import { useEffect, useState } from 'react'
import CourseProgressCard from './CourseProgressCard'
import LearningStreak from './LearningStreak'
import type { Course } from '@/types'

interface ContinueLearningProps {
  courses: Course[]
}

interface CourseProgress {
  completedLessons: string[]
  lastAccessed: string
}

const PROGRESS_KEY = 'learnhub_course_progress'

function getCoursesInProgress(courses: Course[]): { course: Course; progress: CourseProgress }[] {
  if (typeof window === 'undefined') return []
  
  const inProgress: { course: Course; progress: CourseProgress; sortDate: number }[] = []
  
  for (const course of courses) {
    try {
      const stored = localStorage.getItem(`${PROGRESS_KEY}_${course.slug}`)
      if (stored) {
        const progress: CourseProgress = JSON.parse(stored)
        if (progress.completedLessons.length > 0) {
          const lastAccessed = progress.lastAccessed ? new Date(progress.lastAccessed).getTime() : 0
          inProgress.push({ course, progress, sortDate: lastAccessed })
        }
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  // Sort by most recently accessed
  return inProgress
    .sort((a, b) => b.sortDate - a.sortDate)
    .slice(0, 3)
    .map(({ course, progress }) => ({ course, progress }))
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [coursesInProgress, setCoursesInProgress] = useState<{ course: Course; progress: CourseProgress }[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const inProgress = getCoursesInProgress(courses)
    setCoursesInProgress(inProgress)
    setIsLoaded(true)
  }, [courses])

  if (!isLoaded) return null

  if (coursesInProgress.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-primary-400">👋</span> Welcome Back!
            </h2>
            <p className="text-navy-400">Continue where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses in Progress */}
          <div className="lg:col-span-2 space-y-4">
            {coursesInProgress.map(({ course }) => (
              <CourseProgressCard key={course.id} course={course} />
            ))}
          </div>

          {/* Learning Streak */}
          <div className="lg:col-span-1">
            <LearningStreak />
          </div>
        </div>
      </div>
    </section>
  )
}