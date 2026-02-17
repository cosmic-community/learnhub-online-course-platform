'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RecentlyViewedProps {
  courses: Course[]
  currentSlug?: string
}

interface ViewedCourse {
  slug: string
  viewedAt: number
}

export default function RecentlyViewed({ courses, currentSlug }: RecentlyViewedProps) {
  const [recentCourses, setRecentCourses] = useState<Course[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('recently-viewed')
    if (stored) {
      const viewed: ViewedCourse[] = JSON.parse(stored)
      const recentSlugs = viewed
        .filter((v) => v.slug !== currentSlug)
        .sort((a, b) => b.viewedAt - a.viewedAt)
        .slice(0, 3)
        .map((v) => v.slug)

      const matchedCourses = recentSlugs
        .map((slug) => courses.find((c) => c.slug === slug))
        .filter((c): c is Course => c !== undefined)

      setRecentCourses(matchedCourses)
    }
  }, [courses, currentSlug])

  if (recentCourses.length === 0) return null

  return (
    <section className="py-12 bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Continue Learning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-navy-600 transition-colors group"
            >
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=120&h=68&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-20 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-12 rounded-lg bg-navy-700 flex items-center justify-center text-2xl">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                  {course.title}
                </p>
                <p className="text-navy-400 text-sm">
                  {course.metadata?.lessons?.length || 0} lessons
                </p>
              </div>
              <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}