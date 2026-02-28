'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

interface RecentCourse {
  slug: string
  title: string
  timestamp: number
}

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [greeting, setGreeting] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Get time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // Get recently viewed courses from localStorage
    const stored = localStorage.getItem('learnhub-recent-courses')
    if (stored) {
      try {
        const recentSlugs: RecentCourse[] = JSON.parse(stored)
        const matchedCourses = recentSlugs
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3)
          .map(r => courses.find(c => c.slug === r.slug))
          .filter((c): c is Course => c !== undefined)
        
        setRecentCourses(matchedCourses)
      } catch {
        setRecentCourses([])
      }
    }
  }, [courses])

  if (!isClient) return null

  // If user has recent courses, show continue learning
  if (recentCourses.length > 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              {greeting}! Continue Learning
            </h2>
            <p className="text-navy-400 mt-1">Pick up where you left off</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group flex items-center gap-4 p-4 card hover:border-primary-500/50 transition-all"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-navy-800">
                  {course.metadata?.thumbnail?.imgix_url ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=128&h=128&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📚
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-sm text-navy-400 truncate">
                    {course.metadata?.tagline || 'Continue your journey'}
                  </p>
                </div>
                <div className="text-primary-400 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // For new users, show a welcoming quick start
  const suggestedCourses = courses
    .filter(c => c.metadata?.is_free)
    .slice(0, 2)
    .concat(courses.filter(c => !c.metadata?.is_free).slice(0, 1))

  if (suggestedCourses.length === 0) return null

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-6 bg-gradient-to-r from-primary-500/5 via-transparent to-transparent border-primary-500/20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {greeting}! Ready to start learning?
              </h2>
              <p className="text-navy-300">
                Here are some great courses to begin your journey
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {suggestedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 rounded-lg text-sm text-white transition-colors"
                >
                  {course.metadata?.is_free && <span className="text-primary-400">FREE</span>}
                  {course.metadata?.title || course.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}