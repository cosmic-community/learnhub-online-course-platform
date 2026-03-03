'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getInProgressCourses, getLearningStats, type CourseProgress } from '@/lib/progress'
import ProgressBar from './ProgressBar'

export default function ContinueLearning() {
  const [inProgressCourses, setInProgressCourses] = useState<CourseProgress[]>([])
  const [stats, setStats] = useState({ totalCoursesStarted: 0, totalCoursesCompleted: 0, totalLessonsCompleted: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setInProgressCourses(getInProgressCourses().slice(0, 3))
    setStats(getLearningStats())
    setIsLoading(false)
  }, [])

  // Don't render anything if no progress yet
  if (isLoading || (inProgressCourses.length === 0 && stats.totalLessonsCompleted === 0)) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-primary-400">👋</span> Welcome back!
            </h2>
            <p className="text-navy-400">Continue where you left off</p>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{stats.totalLessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.totalCoursesCompleted}</div>
              <div className="text-xs text-navy-400">Courses Completed</div>
            </div>
          </div>
        </div>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => {
              const progress = course.totalLessons > 0 
                ? (course.completedLessons / course.totalLessons) * 100 
                : 0

              return (
                <Link
                  key={course.courseId}
                  href={`/courses/${course.courseSlug}`}
                  className="group card p-4 flex gap-4 hover:border-primary-500/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-navy-800">
                    {course.courseThumbnail ? (
                      <img
                        src={`${course.courseThumbnail}?w=160&h=160&fit=crop&auto=format,compress`}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                    {/* Progress ring overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-950/60">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            strokeWidth="4"
                            fill="none"
                            className="stroke-navy-700"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            strokeWidth="4"
                            fill="none"
                            className="stroke-primary-400"
                            strokeLinecap="round"
                            strokeDasharray={`${progress * 1.257} 125.7`}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
                      {course.courseTitle}
                    </h3>
                    <ProgressBar progress={progress} size="sm" />
                    <p className="text-xs text-navy-400 mt-2">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-navy-500 group-hover:text-primary-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <p className="text-navy-300 mb-4">
              You've completed {stats.totalCoursesCompleted} course{stats.totalCoursesCompleted !== 1 ? 's' : ''}!
            </p>
            <Link href="/courses" className="btn-primary">
              Start a New Course
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}