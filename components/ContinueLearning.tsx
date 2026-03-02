'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastViewed: string
  progress?: number
}

interface ContinueLearningProps {
  allCourses: Course[]
}

export default function ContinueLearning({ allCourses }: ContinueLearningProps) {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      const recent: RecentCourse[] = JSON.parse(stored)
      // Match with actual course data for thumbnails
      const enriched = recent
        .map(r => {
          const course = allCourses.find(c => c.slug === r.slug)
          if (course) {
            return {
              ...r,
              title: course.metadata?.title || course.title,
              thumbnail: course.metadata?.thumbnail?.imgix_url
            }
          }
          return null
        })
        .filter((c): c is RecentCourse => c !== null)
        .slice(0, 3)
      
      setRecentCourses(enriched)
    }
    setIsLoaded(true)
  }, [allCourses])

  if (!isLoaded || recentCourses.length === 0) return null

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-primary-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">👋</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
            <p className="text-navy-400 text-sm">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentCourses.map((course, index) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group relative card-lift overflow-hidden rounded-xl bg-navy-900/80 border border-navy-700 hover:border-primary-500/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative h-32 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={`${course.thumbnail}?w=600&h=300&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/50">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                  {course.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getTimeAgo(course.lastViewed)}
                  </span>
                  
                  <span className="text-primary-400 font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {course.progress !== undefined && course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-700">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}