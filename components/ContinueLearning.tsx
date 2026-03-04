'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCoursesInProgress, getCompletionPercentage, CourseProgress } from '@/lib/progress'
import ProgressRing from './ProgressRing'

export default function ContinueLearning() {
  const [coursesInProgress, setCoursesInProgress] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const courses = getCoursesInProgress()
    setCoursesInProgress(courses.slice(0, 3)) // Show max 3 courses
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-32 bg-navy-800/50 rounded-2xl animate-pulse" />
        </div>
      </section>
    )
  }

  if (coursesInProgress.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursesInProgress.map((course) => {
            const percentage = getCompletionPercentage(course)
            const isComplete = percentage === 100

            return (
              <Link
                key={course.courseSlug}
                href={
                  course.lastLessonSlug
                    ? `/courses/${course.courseSlug}/lessons/${course.lastLessonSlug}`
                    : `/courses/${course.courseSlug}`
                }
                className="group bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-xl p-4 hover:border-primary-500/50 hover:bg-navy-800/70 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <ProgressRing progress={percentage} size={48} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                      {course.courseName}
                    </h3>
                    <p className="text-sm text-navy-400">
                      {isComplete ? (
                        <span className="text-green-400">✓ Completed!</span>
                      ) : (
                        <>
                          {course.completedLessons.length} of {course.totalLessons} lessons
                        </>
                      )}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}