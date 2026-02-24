'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalLessons: number
  completedLessons: number
  currentStreak: number
  lastCourse: string | null
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Gather stats from localStorage
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    const streakData = JSON.parse(localStorage.getItem('learnhub-streak') || '{}')
    const lastVisited = localStorage.getItem('learnhub-last-course')
    
    setStats({
      totalLessons: 31, // Total lessons from CMS
      completedLessons: completedLessons.length,
      currentStreak: streakData.currentStreak || 0,
      lastCourse: lastVisited,
    })
  }, [])

  if (!mounted || !stats) {
    return null
  }

  // Only show if user has some progress
  if (stats.completedLessons === 0 && stats.currentStreak === 0) {
    return null
  }

  const progressPercent = Math.round((stats.completedLessons / stats.totalLessons) * 100)

  return (
    <div className="mb-12">
      <div className="card p-6 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-purple-500/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Learning Journey</h3>
          <span className="text-2xl">📚</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary-400">{stats.currentStreak}</div>
            <div className="text-sm text-navy-400">Day Streak {stats.currentStreak > 0 && '🔥'}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">{stats.completedLessons}</div>
            <div className="text-sm text-navy-400">Lessons Done</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">{progressPercent}%</div>
            <div className="text-sm text-navy-400">Progress</div>
          </div>
          <div className="flex items-center justify-center">
            {stats.lastCourse ? (
              <Link 
                href={`/courses/${stats.lastCourse}`}
                className="btn-primary text-sm py-2"
              >
                Continue Learning →
              </Link>
            ) : (
              <Link 
                href="/courses"
                className="btn-primary text-sm py-2"
              >
                Start Learning →
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}