'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  progress: number
  lastViewed: string
}

const STORAGE_KEY = 'learnhub_recent_courses'

export default function RecentlyViewed() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const courses = JSON.parse(stored) as RecentCourse[]
      // Sort by most recent and take top 3
      const sorted = courses
        .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
        .slice(0, 3)
      setRecentCourses(sorted)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded"></div>
      </div>
    )
  }

  if (recentCourses.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📖</span>
          <h3 className="text-lg font-semibold text-white">Continue Learning</h3>
        </div>
        <p className="text-navy-400 mb-4">
          Start your first course to track your progress here!
        </p>
        <Link href="/courses" className="btn-primary w-full text-center">
          Browse Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📖</span>
          <h3 className="text-lg font-semibold text-white">Continue Learning</h3>
        </div>
        <Link href="/courses" className="text-sm text-primary-400 hover:text-primary-300">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {recentCourses.map((course, index) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className={`block group transition-all duration-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors">
              {course.thumbnail ? (
                <img
                  src={`${course.thumbnail}?w=120&h=80&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-12 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-12 rounded bg-navy-700 flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h4>
                <div className="mt-1">
                  <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-navy-400 mt-1">{course.progress}% complete</span>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}