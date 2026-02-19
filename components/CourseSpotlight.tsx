'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  courses: Course[]
}

export default function CourseSpotlight({ courses }: CourseSpotlightProps) {
  const [spotlightCourse, setSpotlightCourse] = useState<Course | null>(null)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    // Select a "course of the day" based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const courseIndex = dayOfYear % courses.length
    setSpotlightCourse(courses[courseIndex] || null)

    // Calculate time left until midnight
    const updateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date(now)
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [courses])

  if (!spotlightCourse) return null

  const { metadata } = spotlightCourse
  const instructor = metadata?.instructors?.[0]

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/10 via-navy-900 to-navy-950 border border-primary-500/20 rounded-3xl">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Spotlight badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 rounded-full text-sm font-semibold text-white shadow-lg shadow-primary-500/25">
          <span className="animate-pulse">✨</span>
          <span>Course of the Day</span>
        </div>
      </div>

      {/* Timer */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-800/80 backdrop-blur rounded-full text-sm text-navy-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono">{timeLeft}</span>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        {/* Content */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            {metadata?.difficulty && (
              <DifficultyBadge difficulty={metadata.difficulty} />
            )}
            {metadata?.is_free && (
              <span className="badge badge-free">Free Course</span>
            )}
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            {spotlightCourse.title}
          </h2>

          {metadata?.tagline && (
            <p className="text-lg text-navy-300 mb-6">
              {metadata.tagline}
            </p>
          )}

          {/* Course stats */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-navy-400">
            {metadata?.lessons && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{metadata.lessons.length} lessons</span>
              </div>
            )}
            {metadata?.estimated_hours && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{metadata.estimated_hours} hours</span>
              </div>
            )}
            {!metadata?.is_free && metadata?.price && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">${metadata.price}</span>
              </div>
            )}
          </div>

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center gap-3 mb-8 p-3 bg-navy-800/30 rounded-xl">
              {instructor.metadata?.photo ? (
                <img
                  src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format`}
                  alt={instructor.metadata?.name || instructor.title}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                  👨‍🏫
                </div>
              )}
              <div>
                <div className="font-medium text-white">
                  {instructor.metadata?.name || instructor.title}
                </div>
                {instructor.metadata?.credentials && (
                  <div className="text-sm text-navy-400 truncate max-w-xs">
                    {instructor.metadata.credentials}
                  </div>
                )}
              </div>
            </div>
          )}

          <Link
            href={`/courses/${spotlightCourse.slug}`}
            className="btn-primary text-lg w-fit group"
          >
            <span>Start Learning Today</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Image */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 ring-1 ring-white/10">
            {metadata?.thumbnail ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                alt={spotlightCourse.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>
            )}
            
            {/* Play button overlay if video preview exists */}
            {metadata?.preview_video_url && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/30 opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                  <svg className="w-8 h-8 text-navy-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-500/20 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  )
}