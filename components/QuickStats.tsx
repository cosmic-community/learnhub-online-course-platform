'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface QuickStatsProps {
  totalCourses: number
}

interface UserStats {
  bookmarkedCourses: string[]
  viewedCourses: string[]
  completedLessons: string[]
}

export default function QuickStats({ totalCourses }: QuickStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isReturningUser, setIsReturningUser] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-user-stats')
    if (stored) {
      const parsed = JSON.parse(stored) as UserStats
      setStats(parsed)
      setIsReturningUser(parsed.viewedCourses.length > 0 || parsed.bookmarkedCourses.length > 0)
    } else {
      // Initialize stats for new users
      const initial: UserStats = {
        bookmarkedCourses: [],
        viewedCourses: [],
        completedLessons: []
      }
      localStorage.setItem('learnhub-user-stats', JSON.stringify(initial))
      setStats(initial)
    }
  }, [])

  if (!stats || !isReturningUser) return null

  const progressPercentage = Math.round((stats.viewedCourses.length / totalCourses) * 100)

  return (
    <section className="py-6 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <div>
                <div className="text-sm text-navy-400">Courses Explored</div>
                <div className="font-bold text-white">{stats.viewedCourses.length} / {totalCourses}</div>
              </div>
            </div>
            
            {stats.bookmarkedCourses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔖</span>
                <div>
                  <div className="text-sm text-navy-400">Bookmarked</div>
                  <div className="font-bold text-white">{stats.bookmarkedCourses.length}</div>
                </div>
              </div>
            )}
            
            {stats.completedLessons.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="text-sm text-navy-400">Lessons Done</div>
                  <div className="font-bold text-white">{stats.completedLessons.length}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="hidden sm:block">
              <div className="text-xs text-navy-400 mb-1">Discovery Progress</div>
              <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            {stats.bookmarkedCourses.length > 0 && (
              <Link 
                href="/courses?filter=bookmarked" 
                className="btn-secondary text-sm py-2"
              >
                View Bookmarks 🔖
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}