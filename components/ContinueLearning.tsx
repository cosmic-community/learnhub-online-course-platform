'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastLesson?: string
  lastLessonSlug?: string
  progress: number
  lastAccessed: string
}

export default function ContinueLearning() {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('learnhub-recent-courses')
    if (saved) {
      const courses = JSON.parse(saved) as RecentCourse[]
      // Sort by last accessed and take top 3
      const sorted = courses
        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
        .slice(0, 3)
      setRecentCourses(sorted)
    }
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  if (recentCourses.length === 0) {
    return null
  }

  return (
    <section 
      className={`py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">👋</span>
          <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCourses.map((course, index) => (
            <Link
              key={course.slug}
              href={course.lastLessonSlug 
                ? `/courses/${course.slug}/lessons/${course.lastLessonSlug}`
                : `/courses/${course.slug}`
              }
              className="group relative overflow-hidden rounded-xl bg-navy-900/50 border border-navy-800 p-4 hover:border-primary-500/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Progress bar at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-navy-800">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 rounded-lg bg-navy-800 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {course.thumbnail ? (
                    <img 
                      src={`${course.thumbnail}?w=128&h=128&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '📚'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h3>
                  {course.lastLesson && (
                    <p className="text-sm text-navy-400 truncate">
                      Continue: {course.lastLesson}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary-400">{course.progress}% complete</span>
                  </div>
                </div>
                <div className="text-navy-500 group-hover:text-primary-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}