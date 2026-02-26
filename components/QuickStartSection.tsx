'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

const STORAGE_KEY = 'learnhub-quickstart-dismissed'

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!hasMounted || !isVisible || courses.length === 0) return null

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-primary-500/10" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900/80 backdrop-blur-sm border border-navy-700 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-subtle">🚀</span>
              <div>
                <h2 className="text-2xl font-bold text-white">New to coding?</h2>
                <p className="text-navy-400">Start here with beginner-friendly courses</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-navy-500 hover:text-navy-300 transition-colors p-2"
              aria-label="Dismiss quick start"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className={`group flex items-center gap-4 bg-navy-800/50 hover:bg-navy-800 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 animate-fade-in-up stagger-${index + 1}`}
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {course.metadata?.thumbnail?.imgix_url ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                  )}
                  {/* Beginner badge */}
                  <div className="absolute top-1 left-1 bg-green-500/90 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    Beginner
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-sm text-navy-400 truncate">
                    {course.metadata?.tagline || 'Start your learning journey'}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-navy-500">
                    {course.metadata?.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.metadata.estimated_hours}h
                      </span>
                    )}
                    {course.metadata?.lessons?.length && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        {course.metadata.lessons.length} lessons
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-navy-600 group-hover:text-primary-400 transition-colors">
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-6 pt-6 border-t border-navy-700 flex items-center justify-between">
            <p className="text-sm text-navy-400">
              <span className="text-primary-400 font-medium">Pro tip:</span> Start with fundamentals and build up gradually
            </p>
            <Link href="/courses" className="text-sm font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all courses
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}