'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCoursesInProgress, calculateProgressPercentage } from '@/lib/progress'
import ProgressBar from './ProgressBar'
import type { Course } from '@/types'

interface ContinueLearningProps {
  courses: Course[]
}

interface CourseWithProgress {
  course: Course
  completedCount: number
  percentage: number
  lastAccessedAt: string
}

export default function ContinueLearning({ courses }: ContinueLearningProps) {
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseWithProgress[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const progressData = getCoursesInProgress()
    
    const matched = progressData
      .map(progress => {
        const course = courses.find(c => c.slug === progress.courseSlug)
        if (!course) return null
        
        const totalLessons = course.metadata?.lessons?.length ?? 0
        const completedCount = progress.completedLessons.length
        
        // Don't show if course is 100% complete
        if (completedCount >= totalLessons && totalLessons > 0) return null
        
        return {
          course,
          completedCount,
          percentage: calculateProgressPercentage(completedCount, totalLessons),
          lastAccessedAt: progress.lastAccessedAt
        }
      })
      .filter((item): item is CourseWithProgress => item !== null)
      .slice(0, 3) // Show max 3 courses
    
    setCoursesWithProgress(matched)
  }, [courses])

  // Don't render on server or if no courses in progress
  if (!mounted || coursesWithProgress.length === 0) return null

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <section className="py-12 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent border-y border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-2xl">🚀</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
            <p className="text-navy-400 text-sm">Pick up where you left off</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithProgress.map(({ course, completedCount, percentage, lastAccessedAt }) => {
            const totalLessons = course.metadata?.lessons?.length ?? 0
            const thumbnail = course.metadata?.thumbnail
            
            return (
              <Link 
                key={course.id} 
                href={`/courses/${course.slug}`}
                className="group bg-navy-900/70 backdrop-blur-sm border border-navy-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-navy-800">
                    {thumbnail ? (
                      <img
                        src={`${thumbnail.imgix_url}?w=200&h=130&fit=crop&auto=format,compress`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-primary-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-navy-400 mb-2">
                      {completedCount} of {totalLessons} lessons • Last: {formatTimeAgo(lastAccessedAt)}
                    </p>
                    <ProgressBar percentage={percentage} size="small" />
                  </div>
                </div>
                
                {/* Continue Button */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary-400 font-medium">{percentage}% complete</span>
                    <span className="text-navy-400 group-hover:text-primary-400 transition-colors flex items-center gap-1">
                      Continue
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}