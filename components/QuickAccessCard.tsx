'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickAccessCardProps {
  courses: Course[]
}

interface RecentCourse {
  slug: string
  title: string
  timestamp: number
}

export default function QuickAccessCard({ courses }: QuickAccessCardProps) {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get recent courses from localStorage
    const stored = localStorage.getItem('learnhub-recent')
    if (stored) {
      const recent: RecentCourse[] = JSON.parse(stored)
      setRecentCourses(recent.slice(0, 3))
      
      // Find a course they haven't viewed yet for recommendation
      const viewedSlugs = recent.map(r => r.slug)
      const unviewed = courses.filter(c => !viewedSlugs.includes(c.slug))
      
      if (unviewed.length > 0) {
        // Recommend based on similar category if possible
        const lastViewedSlug = recent[0]?.slug
        const lastViewedCourse = courses.find(c => c.slug === lastViewedSlug)
        
        if (lastViewedCourse?.metadata?.categories?.[0]) {
          const categoryId = lastViewedCourse.metadata.categories[0].id
          const sameCategory = unviewed.find(c => 
            c.metadata?.categories?.some(cat => cat.id === categoryId)
          )
          setRecommendedCourse(sameCategory || unviewed[0])
        } else {
          setRecommendedCourse(unviewed[0])
        }
      } else if (courses.length > 0) {
        // If they've seen everything, recommend something random
        setRecommendedCourse(courses[Math.floor(Math.random() * courses.length)])
      }
    } else if (courses.length > 0) {
      // First time visitor - recommend first course
      setRecommendedCourse(courses[0])
    }
  }, [courses])

  if (!mounted) return null

  // Don't show if no data to display
  if (recentCourses.length === 0 && !recommendedCourse) return null

  return (
    <div className="mb-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        {recentCourses.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📖</span>
              <h3 className="text-lg font-semibold text-white">Continue Learning</h3>
            </div>
            <div className="space-y-3">
              {recentCourses.map((recent, index) => {
                const course = courses.find(c => c.slug === recent.slug)
                if (!course) return null
                
                return (
                  <Link
                    key={recent.slug}
                    href={`/courses/${recent.slug}`}
                    className="flex items-center gap-3 p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {course.metadata?.thumbnail ? (
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-navy-700 flex items-center justify-center">
                          📚
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate group-hover:text-primary-400 transition-colors">
                        {course.title}
                      </p>
                      <p className="text-xs text-navy-400">
                        {index === 0 ? 'Last viewed' : `Viewed ${formatTimeAgo(recent.timestamp)}`}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Recommended for You */}
        {recommendedCourse && (
          <div className="card p-6 border-primary-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
            </div>
            <Link
              href={`/courses/${recommendedCourse.slug}`}
              className="block group"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                {recommendedCourse.metadata?.thumbnail ? (
                  <img
                    src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
                    <span className="text-5xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                    {recommendedCourse.title}
                  </p>
                  {recommendedCourse.metadata?.tagline && (
                    <p className="text-sm text-navy-300 line-clamp-1">
                      {recommendedCourse.metadata.tagline}
                    </p>
                  )}
                </div>
              </div>
              <button className="w-full btn-primary group-hover:shadow-primary-500/40">
                Start Learning
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}