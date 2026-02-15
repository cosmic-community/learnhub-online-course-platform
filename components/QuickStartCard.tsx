'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [mounted, setMounted] = useState(false)
  const [lastVisited, setLastVisited] = useState<string | null>(null)
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)

  useEffect(() => {
    setMounted(true)
    const visited = localStorage.getItem('learnhub-last-course')
    if (visited) {
      setLastVisited(visited)
    }
    
    // Find a recommended course (one they haven't visited)
    if (courses.length > 0) {
      const unvisited = courses.find(c => c.slug !== visited)
      setRecommendedCourse(unvisited || courses[0])
    }
  }, [courses])

  if (!mounted || !recommendedCourse) {
    return (
      <div className="bg-gradient-to-br from-primary-500/10 to-navy-900/50 rounded-2xl p-6 border border-primary-500/20">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-2/3 mb-4"></div>
          <div className="h-20 bg-navy-700 rounded"></div>
        </div>
      </div>
    )
  }

  const continueCourseSlugs = lastVisited || recommendedCourse.slug

  return (
    <div className="bg-gradient-to-br from-primary-500/10 to-navy-900/50 rounded-2xl p-6 border border-primary-500/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🚀</span>
          <h3 className="text-xl font-bold text-white">Quick Start</h3>
        </div>

        {lastVisited ? (
          <div className="mb-4">
            <p className="text-navy-400 text-sm mb-3">Continue where you left off</p>
            <Link 
              href={`/courses/${lastVisited}`}
              className="block bg-navy-800/50 rounded-xl p-4 hover:bg-navy-800/80 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                    {courses.find(c => c.slug === lastVisited)?.title || 'Continue Learning'}
                  </div>
                  <div className="text-navy-500 text-sm mt-1">Resume your course →</div>
                </div>
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-navy-400 text-sm mb-3">Recommended for you</p>
            <Link 
              href={`/courses/${recommendedCourse.slug}`}
              className="block bg-navy-800/50 rounded-xl p-4 hover:bg-navy-800/80 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium group-hover:text-primary-400 transition-colors">
                    {recommendedCourse.metadata?.title || recommendedCourse.title}
                  </div>
                  <div className="text-navy-500 text-sm mt-1">{recommendedCourse.metadata?.tagline}</div>
                </div>
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/courses"
            className="bg-navy-800/30 rounded-lg p-3 text-center hover:bg-navy-800/50 transition-colors group"
          >
            <div className="text-xl mb-1">📚</div>
            <div className="text-xs text-navy-400 group-hover:text-navy-300">Browse All</div>
          </Link>
          <Link 
            href="/categories"
            className="bg-navy-800/30 rounded-lg p-3 text-center hover:bg-navy-800/50 transition-colors group"
          >
            <div className="text-xl mb-1">🏷️</div>
            <div className="text-xs text-navy-400 group-hover:text-navy-300">Categories</div>
          </Link>
        </div>
      </div>
    </div>
  )
}