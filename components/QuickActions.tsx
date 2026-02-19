'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCourse {
  slug: string
  title: string
  progress: number
  lastLesson?: string
}

export default function QuickActions() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Load recent courses from localStorage
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      try {
        const courses = JSON.parse(stored)
        setRecentCourses(courses.slice(0, 3))
      } catch {
        setRecentCourses([])
      }
    }
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-800 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-navy-800 rounded" />
          <div className="h-12 bg-navy-800 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        ⚡ Quick Actions
      </h3>

      <div className="space-y-3">
        {recentCourses.length > 0 ? (
          <>
            <p className="text-sm text-navy-400 mb-2">Continue Learning:</p>
            {recentCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{course.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-navy-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-navy-400">{course.progress}%</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </>
        ) : (
          <>
            <Link
              href="/courses"
              className="flex items-center gap-3 p-3 bg-primary-500/10 rounded-lg hover:bg-primary-500/20 transition-colors group border border-primary-500/20"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Start Your First Course</p>
                <p className="text-xs text-navy-400">Begin your learning journey</p>
              </div>
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </>
        )}

        <Link
          href="/categories"
          className="flex items-center gap-3 p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            🎯
          </div>
          <div className="flex-1">
            <p className="text-sm text-white">Explore Categories</p>
            <p className="text-xs text-navy-400">Find your next course</p>
          </div>
          <svg className="w-5 h-5 text-navy-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}