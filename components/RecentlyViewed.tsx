'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ViewedCourse {
  slug: string
  title: string
  thumbnail?: string
  lastViewed: string
  progress: number // 0-100
}

const STORAGE_KEY = 'learnhub_recently_viewed'
const MAX_ITEMS = 3

function getRecentlyViewed(): ViewedCourse[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  
  return []
}

export function addToRecentlyViewed(course: Omit<ViewedCourse, 'lastViewed' | 'progress'>) {
  if (typeof window === 'undefined') return
  
  const viewed = getRecentlyViewed()
  const existingIndex = viewed.findIndex(v => v.slug === course.slug)
  
  const newEntry: ViewedCourse = {
    ...course,
    lastViewed: new Date().toISOString(),
    progress: existingIndex >= 0 ? Math.min(100, viewed[existingIndex].progress + 10) : 10
  }
  
  // Remove existing if present
  if (existingIndex >= 0) {
    viewed.splice(existingIndex, 1)
  }
  
  // Add to beginning
  viewed.unshift(newEntry)
  
  // Keep only max items
  const trimmed = viewed.slice(0, MAX_ITEMS)
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  
  // Also update stats
  const stats = JSON.parse(localStorage.getItem('learnhub_stats') || '{}')
  stats.coursesViewed = (stats.coursesViewed || 0) + 1
  stats.totalMinutesLearned = (stats.totalMinutesLearned || 0) + 5
  localStorage.setItem('learnhub_stats', JSON.stringify(stats))
  
  // Unlock achievement
  const achievements = JSON.parse(localStorage.getItem('learnhub_achievements') || '[]')
  const courseViewerAchievement = achievements.find((a: { id: string }) => a.id === 'course_viewer')
  if (courseViewerAchievement && !courseViewerAchievement.unlocked) {
    courseViewerAchievement.unlocked = true
    courseViewerAchievement.unlockedAt = new Date().toISOString()
    localStorage.setItem('learnhub_achievements', JSON.stringify(achievements))
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

export default function RecentlyViewed() {
  const [recentCourses, setRecentCourses] = useState<ViewedCourse[]>([])

  useEffect(() => {
    setRecentCourses(getRecentlyViewed())
  }, [])

  if (recentCourses.length === 0) {
    return null
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🕐</span> Continue Learning
        </h3>
        <Link 
          href="/courses" 
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {recentCourses.map((course, index) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className={`
              flex items-center gap-4 p-3 rounded-xl
              bg-navy-800/50 hover:bg-navy-800 
              transition-all duration-300
              group
              ${index === 0 ? 'ring-1 ring-primary-500/30' : ''}
            `}
          >
            {/* Thumbnail */}
            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-navy-700">
              {course.thumbnail ? (
                <img 
                  src={`${course.thumbnail}?w=128&h=96&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  📚
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                {course.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-xs text-navy-400 flex-shrink-0">
                  {course.progress}%
                </span>
              </div>
            </div>

            {/* Time ago */}
            <div className="text-xs text-navy-500 flex-shrink-0">
              {formatTimeAgo(course.lastViewed)}
            </div>

            {/* Play icon on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recentCourses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-navy-800">
          <p className="text-xs text-navy-500 text-center">
            💡 Tip: Complete courses to earn achievements and maintain your streak!
          </p>
        </div>
      )}
    </div>
  )
}