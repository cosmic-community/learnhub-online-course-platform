'use client'

import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'
import Link from 'next/link'

interface CourseProgress {
  courseSlug: string
  courseTitle: string
  completedLessons: string[]
  totalLessons: number
  lastAccessed: string
}

const PROGRESS_KEY = 'learnhub_course_progress'

function getCourseProgress(): CourseProgress[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(PROGRESS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export default function QuickStats({ totalCourses, totalLessons }: { totalCourses: number; totalLessons: number }) {
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(getCourseProgress())
  }, [])

  // Calculate stats
  const coursesStarted = progress.length
  const coursesCompleted = progress.filter(
    p => p.completedLessons.length >= p.totalLessons
  ).length
  const totalCompletedLessons = progress.reduce(
    (sum, p) => sum + p.completedLessons.length,
    0
  )
  const overallProgress = totalLessons > 0 
    ? Math.round((totalCompletedLessons / totalLessons) * 100) 
    : 0

  // Get recently accessed courses
  const recentCourses = [...progress]
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
    .slice(0, 3)

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/3 mb-4" />
        <div className="h-24 bg-navy-700 rounded" />
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Your Progress
        </h3>
        {coursesStarted > 0 && (
          <Link 
            href="/courses" 
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Continue Learning →
          </Link>
        )}
      </div>

      {coursesStarted === 0 ? (
        // Empty state for new users
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🚀</div>
          <h4 className="text-white font-medium mb-2">Start Your Learning Journey</h4>
          <p className="text-navy-400 text-sm mb-4">
            Browse our {totalCourses} courses and begin tracking your progress!
          </p>
          <Link href="/courses" className="btn-primary inline-flex">
            Explore Courses
          </Link>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className="flex items-center gap-6 mb-6">
            <ProgressRing 
              progress={overallProgress} 
              size={100}
              label="Overall"
            />
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{coursesStarted}</div>
                <div className="text-xs text-navy-400">Courses Started</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary-400">{coursesCompleted}</div>
                <div className="text-xs text-navy-400">Completed</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{totalCompletedLessons}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
              <div className="bg-navy-800/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {Math.round((totalCompletedLessons / Math.max(1, totalLessons)) * totalCourses * 2)} pts
                </div>
                <div className="text-xs text-navy-400">Points Earned</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {recentCourses.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-navy-300 mb-3">Continue where you left off</h4>
              <div className="space-y-2">
                {recentCourses.map((course) => {
                  const courseProgress = course.totalLessons > 0
                    ? Math.round((course.completedLessons.length / course.totalLessons) * 100)
                    : 0
                  
                  return (
                    <Link
                      key={course.courseSlug}
                      href={`/courses/${course.courseSlug}`}
                      className="block p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white font-medium group-hover:text-primary-400 transition-colors line-clamp-1">
                          {course.courseTitle}
                        </span>
                        <span className="text-xs text-navy-400">
                          {course.completedLessons.length}/{course.totalLessons}
                        </span>
                      </div>
                      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${courseProgress}%` }}
                        />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}