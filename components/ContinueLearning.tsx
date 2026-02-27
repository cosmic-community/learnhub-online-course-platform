'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecentCourses, getLearningStats, type CourseProgress } from '@/lib/progress'
import ProgressBar from './ProgressBar'

export default function ContinueLearning() {
  const [recentCourses, setRecentCourses] = useState<CourseProgress[]>([])
  const [stats, setStats] = useState({ totalCoursesStarted: 0, totalCoursesCompleted: 0, totalLessonsCompleted: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setRecentCourses(getRecentCourses(3))
    setStats(getLearningStats())
  }, [])

  if (!mounted || recentCourses.length === 0) {
    return null
  }

  return (
    <section className="py-12 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Continue Learning
            </h2>
            <p className="text-navy-400">Pick up where you left off</p>
          </div>
          
          {/* Learning Stats */}
          <div className="hidden md:flex items-center gap-6 bg-navy-900/50 rounded-xl px-6 py-3 border border-navy-800">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{stats.totalLessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
            <div className="w-px h-8 bg-navy-700" />
            <div className="text-center">
              <div className="text-xl font-bold text-primary-400">{stats.totalCoursesCompleted}</div>
              <div className="text-xs text-navy-400">Completed</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentCourses.map((course) => {
            const progressPercent = course.totalLessons > 0 
              ? Math.round((course.completedLessons / course.totalLessons) * 100)
              : 0

            return (
              <Link
                key={course.courseId}
                href={`/courses/${course.courseSlug}`}
                className="group card p-5 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 pr-2">
                    {course.courseTitle}
                  </h3>
                  <span className="shrink-0 text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                    {course.completedLessons}/{course.totalLessons}
                  </span>
                </div>
                
                <ProgressBar percent={progressPercent} size="md" />
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-navy-400">
                    Last accessed {formatTimeAgo(course.lastAccessedAt)}
                  </span>
                  <span className="text-primary-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}