'use client'

import Link from 'next/link'
import type { Course } from '@/types'
import { getMetafieldValue } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface CourseCardProps {
  course: Course
  index?: number
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const { metadata } = course
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          // Stagger animation based on index
          setTimeout(() => setIsVisible(true), index * 100)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [index])
  
  // Safely extract difficulty value
  const difficulty = getMetafieldValue(metadata?.difficulty)
  const difficultyLower = difficulty.toLowerCase()
  
  const getDifficultyBadge = (diff: string) => {
    const lower = diff.toLowerCase()
    if (lower.includes('beginner')) return 'badge-beginner'
    if (lower.includes('intermediate')) return 'badge-intermediate'
    if (lower.includes('advanced')) return 'badge-advanced'
    return 'badge-beginner'
  }

  return (
    <Link 
      ref={ref}
      href={`/courses/${course.slug}`} 
      className={`
        card group block transform transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:scale-[1.02]
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Price overlay */}
        <div className="absolute top-4 right-4">
          {metadata?.is_free ? (
            <span className="badge badge-free">Free</span>
          ) : (
            <span className="bg-navy-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
              ${metadata?.price || 0}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((cat) => (
              <span key={cat.id} className="text-xs text-primary-400">
                {cat.metadata?.icon} {cat.metadata?.name || cat.title}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-navy-500">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            )}
          </div>
          
          {difficulty && (
            <span className={`badge ${getDifficultyBadge(difficulty)}`}>
              {difficulty}
            </span>
          )}
        </div>

        {/* Instructors */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-800">
            <div className="flex items-center gap-2">
              {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
                <img
                  src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                  alt={metadata.instructors[0].metadata?.name || ''}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                  <span className="text-sm">👨‍🏫</span>
                </div>
              )}
              <span className="text-sm text-navy-400">
                {metadata.instructors[0]?.metadata?.name || metadata.instructors[0]?.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}