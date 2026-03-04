'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface TodaysPickProps {
  courses: Course[]
}

export default function TodaysPick({ courses }: TodaysPickProps) {
  const [todaysCourse, setTodaysCourse] = useState<Course | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (courses.length === 0) return

    // Use the day of year to consistently pick a course for the day
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)
    
    const courseIndex = dayOfYear % courses.length
    setTodaysCourse(courses[courseIndex] ?? null)
    
    const timer = setTimeout(() => setIsVisible(true), 800)
    return () => clearTimeout(timer)
  }, [courses])

  if (!todaysCourse) return null

  const getDifficultyBadge = (difficulty: string | { value?: string; key?: string } | undefined) => {
    const difficultyValue = typeof difficulty === 'object' ? difficulty?.value ?? difficulty?.key : difficulty
    const difficultyLower = difficultyValue?.toLowerCase() ?? 'beginner'
    
    const badges: Record<string, { class: string; label: string }> = {
      beginner: { class: 'badge-beginner', label: 'Beginner' },
      intermediate: { class: 'badge-intermediate', label: 'Intermediate' },
      advanced: { class: 'badge-advanced', label: 'Advanced' },
    }
    return badges[difficultyLower] ?? badges.beginner
  }

  const difficultyInfo = getDifficultyBadge(todaysCourse.metadata?.difficulty)

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-900/80 border border-primary-500/20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 animate-pulse" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl animate-bounce">⭐</span>
            <span className="text-sm font-semibold text-primary-400 uppercase tracking-wide">
              Today&apos;s Pick for You
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Course Image */}
            {todaysCourse.metadata?.thumbnail && (
              <div className="flex-shrink-0">
                <img
                  src={`${todaysCourse.metadata.thumbnail.imgix_url}?w=300&h=200&fit=crop&auto=format,compress`}
                  alt={todaysCourse.metadata.title ?? todaysCourse.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`badge ${difficultyInfo.class}`}>
                  {difficultyInfo.label}
                </span>
                {todaysCourse.metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {todaysCourse.metadata?.estimated_hours && (
                  <span className="text-xs text-navy-400">
                    ⏱️ {todaysCourse.metadata.estimated_hours}h
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {todaysCourse.metadata?.title ?? todaysCourse.title}
              </h3>
              
              {todaysCourse.metadata?.tagline && (
                <p className="text-navy-300 text-sm mb-4 line-clamp-2">
                  {todaysCourse.metadata.tagline}
                </p>
              )}
              
              <Link
                href={`/courses/${todaysCourse.slug}`}
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group"
              >
                Start Learning
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}