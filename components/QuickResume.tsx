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
  timestamp: number
}

interface QuickResumeProps {
  courses: Course[]
}

export default function QuickResume({ courses }: QuickResumeProps) {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('learnhub_recent')
    if (stored) {
      try {
        const data: RecentCourse[] = JSON.parse(stored)
        // Filter to only courses that still exist and get latest 3
        const validCourses = data
          .filter(recent => courses.some(c => c.slug === recent.slug))
          .slice(0, 3)
        setRecentCourses(validCourses)
      } catch {
        setRecentCourses([])
      }
    }
  }, [courses])

  if (recentCourses.length === 0) {
    return null
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h3 className="text-lg font-semibold text-white">Quick Resume</h3>
      </div>
      
      <div className="space-y-3">
        {recentCourses.map((recent) => {
          const course = courses.find(c => c.slug === recent.slug)
          if (!course) return null
          
          return (
            <Link
              key={recent.slug}
              href={recent.lastLessonSlug 
                ? `/courses/${recent.slug}/lessons/${recent.lastLessonSlug}`
                : `/courses/${recent.slug}`
              }
              className="flex items-center gap-4 p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
            >
              <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                {course.metadata?.thumbnail ? (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=128&h=80&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-navy-700 flex items-center justify-center text-lg">
                    📚
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                  {recent.title}
                </p>
                {recent.lastLesson && (
                  <p className="text-xs text-navy-400 truncate">
                    Continue: {recent.lastLesson}
                  </p>
                )}
              </div>
              <svg 
                className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}