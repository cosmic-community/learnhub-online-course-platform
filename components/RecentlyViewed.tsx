'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewedCourse {
  slug: string
  title: string
  thumbnail?: string
  viewedAt: string
}

export default function RecentlyViewed() {
  const [courses, setCourses] = useState<ViewedCourse[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('recently-viewed-courses')
    if (saved) {
      const parsed = JSON.parse(saved) as ViewedCourse[]
      // Only show last 3 and sort by most recent
      setCourses(parsed.slice(0, 3))
    }
  }, [])

  if (courses.length === 0) {
    return null
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Continue Learning
        </h3>
        <button
          onClick={() => {
            localStorage.removeItem('recently-viewed-courses')
            setCourses([])
          }}
          className="text-navy-500 hover:text-navy-300 text-xs transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="space-y-3">
        {courses.map((course, index) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-navy-800/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center text-xl">
              {index === 0 ? '▶️' : '📖'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">
                {course.title}
              </p>
              <p className="text-navy-500 text-xs">
                {new Date(course.viewedAt).toLocaleDateString()}
              </p>
            </div>
            <svg className="w-4 h-4 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}