'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastViewed: number
  progress: number // percentage
}

export default function RecentlyViewed() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('learnhub_recent')
    if (saved) {
      const courses: RecentCourse[] = JSON.parse(saved)
      // Sort by most recently viewed and take top 3
      const sorted = courses
        .sort((a, b) => b.lastViewed - a.lastViewed)
        .slice(0, 3)
      setRecentCourses(sorted)
    }
  }, [])

  if (recentCourses.length === 0) return null

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>⏱️</span>
          Continue Learning
        </h3>
        <Link href="/courses" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {recentCourses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="flex items-center gap-4 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-all group"
          >
            {/* Thumbnail */}
            <div className="w-16 h-10 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0">
              {course.thumbnail ? (
                <img 
                  src={`${course.thumbnail}?w=128&h=80&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  📚
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                {course.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden max-w-[100px]">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs text-navy-400">{course.progress}%</span>
              </div>
            </div>

            {/* Play button */}
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 transition-all">
              <svg className="w-4 h-4 text-primary-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Time since last visit */}
      {recentCourses[0] && (
        <p className="text-xs text-navy-500 mt-4 text-center">
          Last visited {formatTimeAgo(recentCourses[0].lastViewed)}
        </p>
      )}
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return new Date(timestamp).toLocaleDateString()
}