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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recently-viewed')
    if (stored) {
      const courses = JSON.parse(stored) as ViewedCourse[]
      // Only show last 4, sorted by most recent
      setRecentCourses(courses.sort((a, b) => b.viewedAt - a.viewedAt).slice(0, 4))
    }
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (recentCourses.length === 0) return null

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🕐</span> Continue Learning
        </h3>
        <button
          onClick={() => {
            localStorage.removeItem('learnhub-recently-viewed')
            setRecentCourses([])
          }}
          className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recentCourses.map((course, index) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="group card p-3 hover:border-primary-500/50 transition-all"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="aspect-video rounded-lg bg-navy-800 mb-2 overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={`${course.thumbnail}?w=300&h=170&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  📚
                </div>
              )}
            </div>
            <p className="text-sm text-navy-200 line-clamp-2 group-hover:text-white transition-colors">
              {course.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}