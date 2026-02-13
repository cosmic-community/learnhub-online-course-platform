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
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-600/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Section header with animated badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                <span className="text-xl animate-bounce-slow">⭐</span>
                <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Course of the Day</span>
              </div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent" />
          </div>

          {/* Spotlight card */}
          <Link href={`/courses/${course.slug}`} className="block group">
            <div className="card overflow-hidden bg-gradient-to-br from-navy-900/80 to-navy-800/80 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image side */}
                <div className="relative aspect-video md:aspect-auto md:min-h-[320px] overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                      <span className="text-7xl">📚</span>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-900/90 md:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent md:hidden" />
                  
                  {/* Spotlight badge on image */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-navy-900 rounded-full font-bold text-sm shadow-lg shadow-yellow-500/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      Featured
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className="p-8 flex flex-col justify-center">
                  {/* Categories */}
                  {metadata?.categories && metadata.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {metadata.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="text-xs px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full"
                        >
                          {category.metadata?.icon} {category.metadata?.name || category.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h3>

                  {metadata?.tagline && (
                    <p className="text-navy-300 text-lg mb-6 line-clamp-2">
                      {metadata.tagline}
                    </p>
                  )}

                  {/* Course stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {metadata?.difficulty && (
                      <span className={`badge ${
                        metadata.difficulty.value === 'Beginner' ? 'badge-beginner' :
                        metadata.difficulty.value === 'Intermediate' ? 'badge-intermediate' :
                        'badge-advanced'
                      }`}>
                        {metadata.difficulty.value}
                      </span>
                    )}
                    
                    <span className="flex items-center gap-2 text-navy-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {lessons.length} lessons
                    </span>

                    {metadata?.estimated_hours && (
                      <span className="flex items-center gap-2 text-navy-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {metadata.estimated_hours}h
                      </span>
                    )}
                  </div>

                  {/* Instructor */}
                  {instructors.length > 0 && instructors[0] && (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-navy-700">
                      {instructors[0].metadata?.photo ? (
                        <img
                          src={`${instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                          alt={instructors[0].metadata?.name || instructors[0].title}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-lg">
                          👨‍🏫
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{instructors[0].metadata?.name || instructors[0].title}</p>
                        <p className="text-navy-400 text-sm">Instructor</p>
                      </div>
                    </div>
                  )}

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {metadata?.is_free ? (
                        <span className="text-2xl font-bold text-primary-400">Free</span>
                      ) : (
                        <span className="text-2xl font-bold text-white">${metadata?.price || 0}</span>
                      )}
                    </div>
                    <span className="btn-primary group-hover:bg-primary-400">
                      Start Learning
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}