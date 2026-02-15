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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (courses.length === 0) return

    // Use the date to consistently select a "course of the day"
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const courseIndex = dayOfYear % courses.length
    setSpotlightCourse(courses[courseIndex] ?? courses[0] ?? null)

    setTimeout(() => setIsVisible(true), 300)
  }, [courses])

  if (!spotlightCourse) return null

  const { metadata } = spotlightCourse
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-primary-500/30">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent animate-pulse" />
        
        <div className="relative p-1">
          <div className="flex flex-col lg:flex-row gap-6 p-6 bg-navy-950/90 rounded-xl">
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary-500/30">
                <span className="animate-pulse">⭐</span>
                Course of the Day
              </span>
            </div>

            {/* Thumbnail */}
            <div className="relative lg:w-2/5 aspect-video lg:aspect-auto overflow-hidden rounded-xl mt-10 lg:mt-0">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                  alt={spotlightCourse.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>

            {/* Content */}
            <div className="lg:w-3/5 flex flex-col justify-center lg:pl-4">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {categories.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="text-sm text-primary-400"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                {spotlightCourse.title}
              </h3>

              {metadata?.tagline && (
                <p className="text-navy-300 text-lg mb-4 line-clamp-2">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                {metadata?.estimated_hours && (
                  <span className="flex items-center gap-1 text-navy-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
                {metadata?.lessons && (
                  <span className="flex items-center gap-1 text-navy-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {metadata.lessons.length} lessons
                  </span>
                )}
              </div>

              {/* Instructor & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {instructors.length > 0 && instructors[0] && (
                  <div className="flex items-center gap-3">
                    {instructors[0].metadata?.photo ? (
                      <img
                        src={`${instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                        alt={instructors[0].metadata?.name || instructors[0].title}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-lg">
                        👨‍🏫
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium">
                        {instructors[0].metadata?.name || instructors[0].title}
                      </div>
                      {instructors[0].metadata?.credentials && (
                        <div className="text-xs text-navy-400 line-clamp-1">
                          {instructors[0].metadata.credentials}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Link 
                  href={`/courses/${spotlightCourse.slug}`}
                  className="btn-primary group"
                >
                  <span>Start Learning</span>
                  <svg 
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}