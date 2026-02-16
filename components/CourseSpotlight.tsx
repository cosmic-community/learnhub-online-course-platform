'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <span className="text-3xl">⭐</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Course of the Day</h2>
          <p className="text-navy-400 text-sm">Hand-picked just for you</p>
        </div>
      </div>

      <div className="card overflow-hidden group">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-video md:aspect-auto overflow-hidden">
            {thumbnail ? (
              <img
                src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center min-h-[300px]">
                <span className="text-7xl">📚</span>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-900/50 md:block hidden" />
            
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/90 text-yellow-900 text-sm font-semibold rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-center">
            {/* Categories */}
            {metadata?.categories && metadata.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {metadata.categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-full"
                  >
                    {category.metadata?.icon} {category.metadata?.name || category.title}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
              {course.title}
            </h3>

            {metadata?.tagline && (
              <p className="text-navy-300 mb-6 text-lg">
                {metadata.tagline}
              </p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
              {metadata?.difficulty && (
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    metadata.difficulty.value === 'Beginner' ? 'bg-green-400' :
                    metadata.difficulty.value === 'Intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-navy-300">{metadata.difficulty.value}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-navy-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {lessons.length} lessons
              </div>

              {metadata?.estimated_hours && (
                <div className="flex items-center gap-2 text-navy-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours}h total
                </div>
              )}

              <div className="flex items-center gap-2">
                {metadata?.is_free ? (
                  <span className="text-primary-400 font-semibold">Free</span>
                ) : (
                  <span className="text-white font-semibold">${metadata?.price || 0}</span>
                )}
              </div>
            </div>

            {/* Instructor */}
            {instructors.length > 0 && instructors[0] && (
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-navy-700">
                {instructors[0].metadata?.photo ? (
                  <img
                    src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                    alt={instructors[0].metadata?.name || instructors[0].title}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                    👨‍🏫
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">
                    {instructors[0].metadata?.name || instructors[0].title}
                  </p>
                  {instructors[0].metadata?.credentials && (
                    <p className="text-navy-400 text-sm line-clamp-1">
                      {instructors[0].metadata.credentials}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Link 
              href={`/courses/${course.slug}`} 
              className="btn-primary inline-flex items-center justify-center group/btn"
            >
              <span>Start Learning Today</span>
              <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}