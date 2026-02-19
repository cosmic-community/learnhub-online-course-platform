'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastLesson?: string
  lastLessonSlug?: string
  visitedAt: string
}

interface QuickResumeProps {
  courses: Course[]
}

export default function QuickResume({ courses }: QuickResumeProps) {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      try {
        const recent: RecentCourse[] = JSON.parse(stored)
        // Filter to only courses that still exist and take top 3
        const validRecent = recent
          .filter(r => courses.some(c => c.slug === r.slug))
          .slice(0, 3)
        setRecentCourses(validRecent)
      } catch {
        setRecentCourses([])
      }
    }
  }, [courses])

  if (!mounted || recentCourses.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('learnhub-recent-courses')
            setRecentCourses([])
          }}
          className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentCourses.map((recent, index) => {
          const course = courses.find(c => c.slug === recent.slug)
          if (!course) return null

          return (
            <Link
              key={recent.slug}
              href={recent.lastLessonSlug 
                ? `/courses/${recent.slug}/lessons/${recent.lastLessonSlug}`
                : `/courses/${recent.slug}`
              }
              className="group relative"
            >
              <div className="card p-4 flex items-center gap-4 group-hover:border-primary-500/50 transition-all duration-300">
                {/* Position Badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800">
                  {course.metadata?.thumbnail ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📚
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h3>
                  {recent.lastLesson && (
                    <p className="text-xs text-navy-400 truncate mt-1">
                      📖 {recent.lastLesson}
                    </p>
                  )}
                  <p className="text-xs text-navy-500 mt-1">
                    Last visited {formatTimeAgo(recent.visitedAt)}
                  </p>
                </div>

                {/* Resume Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                  <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}