'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface ViewedCourse {
  id: string
  slug: string
  title: string
  thumbnail?: string
  difficulty?: string
  viewedAt: string
}

interface RecentlyViewedProps {
  currentCourseId?: string
  allCourses: Course[]
}

export default function RecentlyViewed({ currentCourseId, allCourses }: RecentlyViewedProps) {
  const [recentCourses, setRecentCourses] = useState<ViewedCourse[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-recently-viewed')
    if (stored) {
      const viewed: ViewedCourse[] = JSON.parse(stored)
      // Filter out current course and limit to 3
      const filtered = viewed
        .filter(c => c.id !== currentCourseId)
        .slice(0, 3)
      
      if (filtered.length > 0) {
        setRecentCourses(filtered)
        // Delay visibility for animation
        setTimeout(() => setIsVisible(true), 300)
      }
    }
  }, [currentCourseId])

  // Function to track a course view (called from course pages)
  useEffect(() => {
    // Only run on mount to check if we need to track something
    const trackCourse = () => {
      if (!currentCourseId) return
      
      const currentCourse = allCourses.find(c => c.id === currentCourseId)
      if (!currentCourse) return
      
      const stored = localStorage.getItem('learnhub-recently-viewed')
      const viewed: ViewedCourse[] = stored ? JSON.parse(stored) : []
      
      // Remove if already exists
      const filtered = viewed.filter(c => c.id !== currentCourseId)
      
      // Add to front
      const newViewed: ViewedCourse = {
        id: currentCourse.id,
        slug: currentCourse.slug,
        title: currentCourse.title,
        thumbnail: currentCourse.metadata?.thumbnail?.imgix_url,
        difficulty: currentCourse.metadata?.difficulty?.value,
        viewedAt: new Date().toISOString()
      }
      
      filtered.unshift(newViewed)
      
      // Keep only last 10
      const trimmed = filtered.slice(0, 10)
      localStorage.setItem('learnhub-recently-viewed', JSON.stringify(trimmed))
    }
    
    trackCourse()
  }, [currentCourseId, allCourses])

  if (recentCourses.length === 0 || !isVisible) return null

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-navy-700 text-navy-300'
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="py-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">👀</span>
          <h2 className="text-xl font-bold text-white">Continue Learning</h2>
          <span className="text-sm text-navy-400">Pick up where you left off</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`group flex items-center gap-4 p-4 bg-navy-900/50 border border-navy-800 rounded-xl hover:border-primary-500/50 hover:bg-navy-900 transition-all duration-300 ${
                index === 0 ? 'animate-slide-up' :
                index === 1 ? 'animate-slide-up-delay-1' :
                'animate-slide-up-delay-2'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-navy-800">
                {course.thumbnail ? (
                  <img
                    src={`${course.thumbnail}?w=128&h=128&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📚
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {course.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-navy-500">
                    {getTimeAgo(course.viewedAt)}
                  </span>
                </div>
              </div>
              
              {/* Arrow */}
              <svg 
                className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}