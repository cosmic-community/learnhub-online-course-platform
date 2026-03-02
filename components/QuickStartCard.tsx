'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

interface RecentCourse {
  slug: string
  title: string
  thumbnail?: string
  lastLesson?: string
  progress: number
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      const parsed = JSON.parse(stored) as RecentCourse[]
      // Only keep courses that still exist
      const validCourses = parsed.filter(rc => 
        courses.some(c => c.slug === rc.slug)
      ).slice(0, 3)
      setRecentCourses(validCourses)
    }
    setTimeout(() => setIsVisible(true), 700)
  }, [courses])

  if (recentCourses.length === 0) {
    return (
      <div 
        className={`transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-navy-900/50 border-primary-500/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-white">Ready to Start?</h3>
          </div>
          <p className="text-navy-300 mb-4">
            Pick your first course and begin your learning journey today!
          </p>
          <Link 
            href="/courses" 
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            Browse Courses
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="card p-6 bg-gradient-to-br from-green-500/10 to-navy-900/50 border-green-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h3 className="text-lg font-semibold text-white">Continue Learning</h3>
          </div>
          <Link href="/courses" className="text-sm text-primary-400 hover:text-primary-300">
            View all →
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentCourses.map((course, index) => {
            const fullCourse = courses.find(c => c.slug === course.slug)
            const thumbnail = fullCourse?.metadata?.thumbnail?.imgix_url
            
            return (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-4 p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
              >
                {thumbnail && (
                  <img 
                    src={`${thumbnail}?w=80&h=60&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden max-w-[100px]">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-navy-400">{course.progress}%</span>
                  </div>
                </div>
                <svg 
                  className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}