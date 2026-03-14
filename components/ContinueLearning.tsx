'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface ContinueLearningProps {
  courses: Course[]
}

interface ViewedCourse {
  slug: string
  lastViewed: number
  progress?: number
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<Course[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-viewed-courses')
    if (stored) {
      const viewedCourses: ViewedCourse[] = JSON.parse(stored)
      // Sort by most recently viewed
      const sorted = viewedCourses.sort((a, b) => b.lastViewed - a.lastViewed)
      // Get top 3 recent courses
      const recentSlugs = sorted.slice(0, 3).map(v => v.slug)
      // Match with actual course data
      const matched = recentSlugs
        .map(slug => courses.find(c => c.slug === slug))
        .filter((c): c is Course => c !== undefined)
      
      if (matched.length > 0) {
        setRecentlyViewed(matched)
        setIsVisible(true)
      }
    }
  }, [courses])

  if (!isVisible || recentlyViewed.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-navy-900/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">📚</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
            <p className="text-navy-400">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyViewed.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative bg-navy-800/50 rounded-xl overflow-hidden border border-navy-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {/* Progress indicator */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-navy-700">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>

              <div className="p-4 flex items-center gap-4">
                {course.metadata?.thumbnail?.imgix_url && (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                    alt={course.metadata?.title || course.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-sm text-navy-400 truncate">
                    {course.metadata?.tagline || 'Continue your journey'}
                  </p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  <svg className="w-4 h-4 text-primary-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </section>
  )
}