'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CourseProgress {
  courseSlug: string
  courseName: string
  completedLessons: number
  totalLessons: number
  lastAccessed: string
}

function getStoredProgress(): CourseProgress[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('learnhub-progress')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  
  // Demo data for first-time visitors
  const demoProgress: CourseProgress[] = [
    {
      courseSlug: 'vue-fundamentals',
      courseName: 'Vue.js Fundamentals',
      completedLessons: 2,
      totalLessons: 3,
      lastAccessed: new Date().toISOString(),
    },
    {
      courseSlug: 'nodejs-backend-development',
      courseName: 'Node.js Backend',
      completedLessons: 1,
      totalLessons: 3,
      lastAccessed: new Date(Date.now() - 86400000).toISOString(),
    },
  ]
  
  localStorage.setItem('learnhub-progress', JSON.stringify(demoProgress))
  return demoProgress
}

function CircularProgress({ progress, size = 60 }: { progress: number; size?: number }) {
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-navy-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{progress}%</span>
      </div>
    </div>
  )
}

export default function QuickProgress() {
  const [progress, setProgress] = useState<CourseProgress[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(getStoredProgress())
  }, [])

  if (!mounted) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-navy-800 rounded w-1/3"></div>
          <div className="h-20 bg-navy-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (progress.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-lg font-semibold text-white mb-2">Start Your Journey</h3>
        <p className="text-navy-400 text-sm mb-4">
          Begin learning and track your progress across all courses!
        </p>
        <Link href="/courses" className="btn-primary text-sm">
          Explore Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>📊</span> Continue Learning
      </h3>
      
      <div className="space-y-4">
        {progress.slice(0, 3).map((course) => {
          const percentComplete = Math.round((course.completedLessons / course.totalLessons) * 100)
          const isComplete = percentComplete === 100
          
          return (
            <Link
              key={course.courseSlug}
              href={`/courses/${course.courseSlug}`}
              className="flex items-center gap-4 p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
            >
              <CircularProgress progress={percentComplete} />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                  {course.courseName}
                </h4>
                <p className="text-xs text-navy-400">
                  {course.completedLessons}/{course.totalLessons} lessons
                  {isComplete && <span className="ml-2 text-green-400">✓ Complete!</span>}
                </p>
              </div>
              
              <div className="text-navy-400 group-hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
      
      <Link 
        href="/courses" 
        className="mt-4 block text-center text-sm text-primary-400 hover:text-primary-300 transition-colors"
      >
        View all courses →
      </Link>
    </div>
  )
}