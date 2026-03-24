'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Course, Lesson } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

interface RecentActivity {
  courseSlug: string
  lessonSlug: string
  courseName: string
  lessonName: string
  progress: number
  lastAccessed: string
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null)
  const [timeOfDay, setTimeOfDay] = useState<string>('')

  useEffect(() => {
    // Get time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // Load recent activity from localStorage
    const stored = localStorage.getItem('learnhub-recent-activity')
    if (stored) {
      setRecentActivity(JSON.parse(stored))
    }
  }, [])

  const getGreeting = (): string => {
    const greetings = {
      morning: '☀️ Good morning! Ready to learn?',
      afternoon: '🌤️ Good afternoon! Time for a lesson?',
      evening: '🌙 Good evening! Wind down with some learning?',
    }
    return greetings[timeOfDay as keyof typeof greetings] || 'Welcome back!'
  }

  const getRandomCourse = (): Course | null => {
    if (courses.length === 0) return null
    return courses[Math.floor(Math.random() * courses.length)]
  }

  const suggestedCourse = getRandomCourse()

  if (!suggestedCourse && !recentActivity) {
    return null
  }

  return (
    <div className="card p-6 border-navy-700 bg-gradient-to-r from-navy-900/80 to-primary-900/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-navy-300 text-sm mb-1">{getGreeting()}</p>
          <h3 className="text-xl font-bold text-white">
            {recentActivity ? 'Continue Learning' : 'Start Something New'}
          </h3>
        </div>
        <div className="text-4xl animate-bounce">
          {recentActivity ? '📚' : '🚀'}
        </div>
      </div>

      {recentActivity ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-medium">{recentActivity.courseName}</p>
              <p className="text-navy-400 text-sm">{recentActivity.lessonName}</p>
            </div>
            <div className="text-right">
              <div className="text-primary-400 font-bold text-lg">
                {recentActivity.progress}%
              </div>
              <div className="text-navy-500 text-xs">completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-navy-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${recentActivity.progress}%` }}
            />
          </div>

          <Link
            href={`/courses/${recentActivity.courseSlug}/lessons/${recentActivity.lessonSlug}`}
            className="btn-primary w-full justify-center group"
          >
            <span>Continue Lesson</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : suggestedCourse ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {suggestedCourse.metadata?.thumbnail?.imgix_url && (
              <img
                src={`${suggestedCourse.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                alt={suggestedCourse.title}
                className="w-20 h-14 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-white font-medium line-clamp-1">
                {suggestedCourse.metadata?.title || suggestedCourse.title}
              </p>
              <p className="text-navy-400 text-sm line-clamp-1">
                {suggestedCourse.metadata?.tagline || 'Start your learning journey'}
              </p>
            </div>
          </div>

          <Link
            href={`/courses/${suggestedCourse.slug}`}
            className="btn-primary w-full justify-center group"
          >
            <span>Explore Course</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ) : null}
    </div>
  )
}