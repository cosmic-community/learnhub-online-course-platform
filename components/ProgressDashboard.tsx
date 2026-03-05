'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getInProgressCourses, getCompletedCourses, getStats, type CourseProgress } from '@/lib/progress'

export default function ProgressDashboard() {
  const [inProgress, setInProgress] = useState<CourseProgress[]>([])
  const [completed, setCompleted] = useState<CourseProgress[]>([])
  const [stats, setStats] = useState({ totalCoursesStarted: 0, totalCoursesCompleted: 0, totalLessonsCompleted: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateData()

    const handleUpdate = () => updateData()
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('progressUpdate', handleUpdate)

    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('progressUpdate', handleUpdate)
    }
  }, [])

  const updateData = () => {
    setInProgress(getInProgressCourses())
    setCompleted(getCompletedCourses())
    setStats(getStats())
  }

  if (!mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-navy-800 rounded-2xl mb-8" />
        <div className="h-48 bg-navy-800 rounded-2xl" />
      </div>
    )
  }

  const hasProgress = inProgress.length > 0 || completed.length > 0

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-400 mb-1">
            {stats.totalCoursesStarted}
          </div>
          <div className="text-navy-400 text-sm">Courses Started</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {stats.totalCoursesCompleted}
          </div>
          <div className="text-navy-400 text-sm">Courses Completed</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {stats.totalLessonsCompleted}
          </div>
          <div className="text-navy-400 text-sm">Lessons Completed</div>
        </div>
      </div>

      {!hasProgress ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">Start Your Learning Journey</h3>
          <p className="text-navy-400 mb-6">
            You haven&apos;t started any courses yet. Browse our catalog and begin learning today!
          </p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          {/* In Progress */}
          {inProgress.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span> In Progress
              </h2>
              <div className="grid gap-4">
                {inProgress.map((course) => {
                  const percentage = course.totalLessons > 0 
                    ? Math.round((course.completedLessons.length / course.totalLessons) * 100)
                    : 0
                  
                  return (
                    <Link
                      key={course.courseId}
                      href={`/courses/${course.courseSlug}`}
                      className="card p-4 hover:bg-navy-800/70 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {course.courseTitle}
                        </h3>
                        <span className="text-sm text-primary-400 font-medium">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-navy-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-navy-500">
                        {course.completedLessons.length} of {course.totalLessons} lessons completed
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Completed
              </h2>
              <div className="grid gap-4">
                {completed.map((course) => (
                  <Link
                    key={course.courseId}
                    href={`/courses/${course.courseSlug}`}
                    className="card p-4 hover:bg-navy-800/70 transition-colors group border-green-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {course.courseTitle}
                        </h3>
                      </div>
                      <span className="text-xs text-navy-500">
                        {course.completedAt && new Date(course.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}