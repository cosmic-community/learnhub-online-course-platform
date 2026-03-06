'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewedCourse {
  slug: string
  title: string
  thumbnail?: string
  viewedAt: number
}

export default function RecentlyViewed() {
  const [recentCourses, setRecentCourses] = useState<ViewedCourse[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recently-viewed')
    if (stored) {
      const courses: ViewedCourse[] = JSON.parse(stored)
      // Get last 3 viewed courses
      setRecentCourses(courses.slice(0, 3))
    }
  }, [])

  if (recentCourses.length === 0) return null

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>🕐</span>
        Continue Learning
      </h3>
      <div className="space-y-3">
        {recentCourses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
          >
            {course.thumbnail ? (
              <img 
                src={`${course.thumbnail}?w=80&h=60&fit=crop&auto=format,compress`}
                alt=""
                className="w-16 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-12 rounded bg-navy-700 flex items-center justify-center text-2xl">
                📚
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                {course.title}
              </div>
              <div className="text-xs text-navy-400">
                {formatTimeAgo(course.viewedAt)}
              </div>
            </div>
            <div className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(timestamp).toLocaleDateString()
}