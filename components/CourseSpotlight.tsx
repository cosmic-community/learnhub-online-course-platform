'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSpotlightProps {
  course: Course
}

// Helper to safely get difficulty value
function getDifficultyValue(difficulty: unknown): string {
  if (!difficulty) return 'beginner'
  if (typeof difficulty === 'string') return difficulty
  if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value).toLowerCase()
  }
  return 'beginner'
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const { metadata } = course

  useEffect(() => {
    setIsVisible(true)
    
    // Calculate time until midnight (when the spotlight changes)
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow.getTime() - now.getTime()
      
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const difficultyValue = getDifficultyValue(metadata?.difficulty)
  const lessonCount = Array.isArray(metadata?.lessons) ? metadata.lessons.length : 0
  const instructors = Array.isArray(metadata?.instructors) ? metadata.instructors : []
  const firstInstructor = instructors[0]

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
          <span className="text-2xl">⭐</span>
          <span className="text-yellow-400 font-semibold">Course of the Day</span>
        </div>
        
        {/* Countdown timer */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full text-sm">
          <span className="text-navy-400">New spotlight in</span>
          <div className="flex items-center gap-1 font-mono text-white">
            <span className="bg-navy-700 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-navy-500">:</span>
            <span className="bg-navy-700 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-navy-500">:</span>
            <span className="bg-navy-700 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
            {metadata?.thumbnail?.imgix_url ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-navy-900 flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent lg:bg-gradient-to-r" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
              <span className={`badge badge-${difficultyValue}`}>
                {difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-4">
              {metadata?.tagline && (
                <p className="text-primary-400 font-medium mb-2">{metadata.tagline}</p>
              )}
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {metadata?.title || course.title}
              </h3>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400 mb-6">
              {lessonCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{lessonCount} lessons</span>
                </div>
              )}
              {metadata?.estimated_hours && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{metadata.estimated_hours} hours</span>
                </div>
              )}
              {!metadata?.is_free && metadata?.price && (
                <div className="flex items-center gap-1.5 text-green-400">
                  <span className="font-semibold">${metadata.price}</span>
                </div>
              )}
            </div>

            {/* Instructor */}
            {firstInstructor && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-navy-800/50 rounded-lg">
                {firstInstructor.metadata?.photo?.imgix_url ? (
                  <img
                    src={`${firstInstructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={firstInstructor.metadata?.name || firstInstructor.title}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-lg">👨‍🏫</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">
                    {firstInstructor.metadata?.name || firstInstructor.title}
                  </p>
                  {firstInstructor.metadata?.credentials && (
                    <p className="text-navy-400 text-xs line-clamp-1">
                      {firstInstructor.metadata.credentials}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/courses/${course.slug}`}
              className="btn-primary inline-flex items-center justify-center group"
            >
              Explore This Course
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}