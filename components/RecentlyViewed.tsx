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
    const stored = localStorage.getItem('learnhub-recent')
    if (stored) {
      const courses: ViewedCourse[] = JSON.parse(stored)
      // Sort by most recent and take top 4
      const sorted = courses.sort((a, b) => b.viewedAt - a.viewedAt).slice(0, 4)
      setRecentCourses(sorted)
    }
  }, [])

  if (recentCourses.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/5 via-navy-900/50 to-primary-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
          <span className="text-navy-400 text-sm">Pick up where you left off</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentCourses.map((course, index) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group relative overflow-hidden rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {course.thumbnail ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`${course.thumbnail}?w=400&h=225&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {course.title}
                </h3>
              </div>
              
              {/* Progress indicator (decorative) */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-700">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}