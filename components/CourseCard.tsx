'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Course } from '@/types'
import ProgressRing from './ProgressRing'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress from localStorage
    const courseProgress = localStorage.getItem(`course-progress-${course.slug}`)
    if (courseProgress && metadata?.lessons) {
      const completed = JSON.parse(courseProgress)
      const completedCount = Object.values(completed).filter(Boolean).length
      const totalLessons = metadata.lessons.length
      setProgress(totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0)
    }
  }, [course.slug, metadata?.lessons])

  // Get difficulty value safely
  const getDifficultyValue = (): string => {
    if (!metadata?.difficulty) return 'beginner'
    if (typeof metadata.difficulty === 'string') return metadata.difficulty.toLowerCase()
    if (typeof metadata.difficulty === 'object' && metadata.difficulty !== null) {
      const diffObj = metadata.difficulty as { value?: string; key?: string }
      return (diffObj.value || diffObj.key || 'beginner').toLowerCase()
    }
    return 'beginner'
  }

  const difficultyValue = getDifficultyValue()

  const getDifficultyBadge = () => {
    const badges: Record<string, string> = {
      beginner: 'badge-beginner',
      intermediate: 'badge-intermediate', 
      advanced: 'badge-advanced',
    }
    return badges[difficultyValue] || 'badge-beginner'
  }

  const formatDifficulty = () => {
    return difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)
  }

  return (
    <Link href={`/courses/${course.slug}`} className="card group block relative overflow-hidden">
      {/* Progress indicator */}
      {progress > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <ProgressRing progress={progress} size={40} strokeWidth={3} />
        </div>
      )}
      
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
            alt={metadata.title || course.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className={`badge ${getDifficultyBadge()}`}>
            {formatDifficulty()}
          </span>
          {metadata?.is_free && (
            <span className="badge badge-free">Free</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">{metadata.tagline}</p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-navy-400">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons && metadata.lessons.length > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            )}
          </div>
          
          {!metadata?.is_free && metadata?.price && (
            <span className="text-primary-400 font-semibold">${metadata.price}</span>
          )}
        </div>

        {/* Progress bar at bottom */}
        {progress > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-700">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-navy-400">Progress</span>
              <span className="text-primary-400 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}