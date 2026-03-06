'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Course } from '@/types'

interface TodaysPickProps {
  courses: Course[]
}

export default function TodaysPick({ courses }: TodaysPickProps) {
  const [todaysCourse, setTodaysCourse] = useState<Course | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    if (courses.length === 0) return
    
    // Use today's date as a seed for consistent "random" pick
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const index = dayOfYear % courses.length
    setTodaysCourse(courses[index])
    
    // Reveal animation after a short delay
    const timer = setTimeout(() => setIsRevealed(true), 500)
    return () => clearTimeout(timer)
  }, [courses])

  if (!todaysCourse) return null

  const getDifficultyClass = (difficulty: string | { key: string; value: string } | undefined): string => {
    const diffValue = typeof difficulty === 'object' ? difficulty?.value?.toLowerCase() : difficulty?.toLowerCase()
    switch (diffValue) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'badge-beginner'
    }
  }

  const getDifficultyLabel = (difficulty: string | { key: string; value: string } | undefined): string => {
    if (!difficulty) return 'Beginner'
    return typeof difficulty === 'object' ? difficulty.value : difficulty
  }

  return (
    <div className="relative">
      <div className={`transform transition-all duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl animate-pulse">✨</span>
          <h3 className="text-lg font-semibold text-white">Today's Featured Pick</h3>
          <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">For You</span>
        </div>
        
        <Link href={`/courses/${todaysCourse.slug}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700/50 hover:border-primary-500/50 transition-all duration-300">
            {/* Course thumbnail with gradient overlay */}
            <div className="relative h-48 overflow-hidden">
              {todaysCourse.metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${todaysCourse.metadata.thumbnail.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
                  alt={todaysCourse.metadata?.title || todaysCourse.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
              
              {/* Floating sparkles */}
              <div className="absolute top-4 right-4 text-2xl animate-bounce">⭐</div>
            </div>

            <div className="p-6 -mt-12 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge ${getDifficultyClass(todaysCourse.metadata?.difficulty)}`}>
                  {getDifficultyLabel(todaysCourse.metadata?.difficulty)}
                </span>
                {todaysCourse.metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                {todaysCourse.metadata?.title || todaysCourse.title}
              </h4>
              
              {todaysCourse.metadata?.tagline && (
                <p className="text-navy-300 text-sm line-clamp-2 mb-4">
                  {todaysCourse.metadata.tagline}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-navy-400">
                  {todaysCourse.metadata?.estimated_hours && (
                    <span className="flex items-center gap-1">
                      ⏱️ {todaysCourse.metadata.estimated_hours}h
                    </span>
                  )}
                  {todaysCourse.metadata?.lessons && (
                    <span className="flex items-center gap-1">
                      📖 {todaysCourse.metadata.lessons.length} lessons
                    </span>
                  )}
                </div>
                
                <span className="text-primary-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Learning
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}