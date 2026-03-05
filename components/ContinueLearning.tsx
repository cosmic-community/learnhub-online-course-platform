'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RecentCourse {
  slug: string
  lastVisited: number
  progress?: number
}

interface ContinueLearningProps {
  courses: Course[]
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      const recentData: RecentCourse[] = JSON.parse(stored)
      // Sort by most recent and take top 3
      const sortedRecent = recentData
        .sort((a, b) => b.lastVisited - a.lastVisited)
        .slice(0, 3)
      
      // Match with actual course data
      const matchedCourses = sortedRecent
        .map(r => courses.find(c => c.slug === r.slug))
        .filter((c): c is Course => c !== undefined)
      
      if (matchedCourses.length > 0) {
        setRecentCourses(matchedCourses)
        setIsVisible(true)
      }
    }
  }, [courses])

  if (!isVisible || recentCourses.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
          <span className="text-sm text-navy-400">Pick up where you left off</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex items-center gap-4 p-4 bg-navy-800/50 border border-navy-700 rounded-xl hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-300"
            >
              {course.metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                  alt={course.metadata?.title || course.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📖</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                  {course.metadata?.title || course.title}
                </h3>
                <p className="text-sm text-navy-400 truncate">
                  {course.metadata?.tagline || 'Continue your learning journey'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-primary-400 font-medium">
                    Resume →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}