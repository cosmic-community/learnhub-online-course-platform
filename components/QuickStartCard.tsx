'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Lesson } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

interface RecentProgress {
  courseSlug: string
  lessonSlug: string
  courseName: string
  lessonName: string
  timestamp: number
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [recentProgress, setRecentProgress] = useState<RecentProgress | null>(null)
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)

  useEffect(() => {
    // Load recent progress from localStorage
    const savedProgress = localStorage.getItem('learnhub-recent-progress')
    if (savedProgress) {
      setRecentProgress(JSON.parse(savedProgress))
    }

    // Set a recommended course (random one the user hasn't started)
    const viewedCourses = JSON.parse(localStorage.getItem('learnhub-viewed-courses') || '[]')
    const unviewedCourses = courses.filter(c => !viewedCourses.includes(c.slug))
    
    if (unviewedCourses.length > 0) {
      setRecommendedCourse(unviewedCourses[Math.floor(Math.random() * unviewedCourses.length)])
    } else if (courses.length > 0) {
      setRecommendedCourse(courses[Math.floor(Math.random() * courses.length)])
    }
  }, [courses])

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        Quick Start
      </h3>

      {recentProgress ? (
        <div className="space-y-4">
          <div className="text-sm text-navy-400">Continue where you left off</div>
          <Link
            href={`/courses/${recentProgress.courseSlug}/lessons/${recentProgress.lessonSlug}`}
            className="block group"
          >
            <div className="bg-navy-900/50 rounded-lg p-4 border border-navy-700 hover:border-primary-500/50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                    {recentProgress.lessonName}
                  </div>
                  <div className="text-sm text-navy-400 mt-1">
                    {recentProgress.courseName}
                  </div>
                </div>
                <div className="text-xs text-navy-500">
                  {getTimeAgo(recentProgress.timestamp)}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-primary-400 text-sm font-medium">
                Continue Learning
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      ) : recommendedCourse ? (
        <div className="space-y-4">
          <div className="text-sm text-navy-400">Recommended for you</div>
          <Link
            href={`/courses/${recommendedCourse.slug}`}
            className="block group"
          >
            <div className="bg-navy-900/50 rounded-lg p-4 border border-navy-700 hover:border-primary-500/50 transition-all">
              <div className="flex items-start gap-4">
                {recommendedCourse.metadata?.thumbnail?.imgix_url && (
                  <img
                    src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                    alt={recommendedCourse.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                    {recommendedCourse.metadata?.title || recommendedCourse.title}
                  </div>
                  <div className="text-sm text-navy-400 mt-1 line-clamp-1">
                    {recommendedCourse.metadata?.tagline}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-primary-400 text-sm font-medium">
                Start Learning
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-navy-400 text-sm mb-3">Ready to start learning?</p>
          <Link href="/courses" className="btn-primary text-sm">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  )
}