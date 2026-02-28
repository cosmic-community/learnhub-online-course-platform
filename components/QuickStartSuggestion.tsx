'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSuggestionProps {
  course: Course
}

export default function QuickStartSuggestion({ course }: QuickStartSuggestionProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (isDismissed) return null

  const { metadata } = course
  const instructor = metadata?.instructors?.[0]
  const thumbnailUrl = metadata?.thumbnail?.imgix_url
    ? `${metadata.thumbnail.imgix_url}?w=200&h=150&fit=crop&auto=format,compress`
    : null

  return (
    <section className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-navy-900 border border-green-500/20 transition-all duration-300 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-navy-800/80 hover:bg-navy-700 text-navy-400 hover:text-white flex items-center justify-center transition-colors z-10"
            aria-label="Dismiss suggestion"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Thumbnail */}
              {thumbnailUrl && (
                <div className="flex-shrink-0 relative group">
                  <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-navy-800">
                    <img
                      src={thumbnailUrl}
                      alt={metadata?.title || course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-green-500/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Perfect for Beginners
                  </span>
                  {metadata?.is_free && (
                    <span className="badge badge-free text-xs">Free</span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                  {metadata?.title || course.title}
                </h3>

                {metadata?.tagline && (
                  <p className="text-navy-300 text-sm mb-3 line-clamp-1">
                    {metadata.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400 mb-4">
                  {instructor && (
                    <div className="flex items-center gap-2">
                      {instructor.metadata?.photo?.imgix_url && (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || instructor.title}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span>{instructor.metadata?.name || instructor.title}</span>
                    </div>
                  )}
                  {metadata?.estimated_hours && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{metadata.estimated_hours}h</span>
                    </div>
                  )}
                  {metadata?.lessons && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{metadata.lessons.length} lessons</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 group"
                >
                  <span>Start Learning</span>
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}