'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardAnimatedProps {
  course: Course
  index?: number
}

export default function CourseCardAnimated({ course, index = 0 }: CourseCardAnimatedProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { metadata } = course

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger animation based on index
          setTimeout(() => {
            setIsVisible(true)
          }, index * 100)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [index])

  // Helper to extract difficulty value
  const getDifficulty = (): string => {
    if (!metadata?.difficulty) return 'beginner'
    if (typeof metadata.difficulty === 'string') return metadata.difficulty.toLowerCase()
    if (typeof metadata.difficulty === 'object' && 'value' in metadata.difficulty) {
      return String(metadata.difficulty.value).toLowerCase()
    }
    return 'beginner'
  }

  const difficulty = getDifficulty()

  const getDifficultyBadgeClass = (): string => {
    switch (difficulty) {
      case 'beginner': return 'badge-beginner'
      case 'intermediate': return 'badge-intermediate'
      case 'advanced': return 'badge-advanced'
      default: return 'badge-beginner'
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/courses/${course.slug}`} className="block group">
        <div className={`card overflow-hidden transition-all duration-300 ${
          isHovered ? 'transform -translate-y-2 shadow-2xl shadow-primary-500/10' : ''
        }`}>
          {/* Thumbnail */}
          <div className="aspect-video relative overflow-hidden">
            {metadata?.thumbnail?.imgix_url ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-0'
            }`} />
            
            {/* Play button on hover */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Price badge */}
            <div className="absolute top-4 right-4">
              {metadata?.is_free ? (
                <span className="badge badge-free">Free</span>
              ) : (
                <span className="badge bg-navy-900/90 text-white">
                  ${metadata?.price || 0}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${getDifficultyBadgeClass()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              {metadata?.estimated_hours && (
                <span className="text-navy-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours}h
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
              {metadata?.title || course.title}
            </h3>

            {metadata?.tagline && (
              <p className="text-navy-400 text-sm line-clamp-2 mb-4">{metadata.tagline}</p>
            )}

            {/* Instructor */}
            {metadata?.instructors && metadata.instructors.length > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t border-navy-700">
                {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
                  <img
                    src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                    alt={metadata.instructors[0].metadata?.name || ''}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                )}
                <span className="text-sm text-navy-300">
                  {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}