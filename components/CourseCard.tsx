'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course

  // Track course view for "Continue Learning" feature
  useEffect(() => {
    // This runs on mount, indicating user has seen this course card
    // We'll track actual visits in the course detail page
  }, [])

  const handleCourseClick = () => {
    // Save to recently viewed courses
    try {
      const stored = localStorage.getItem('learnhub-recent-courses')
      const recent = stored ? JSON.parse(stored) : []
      
      // Remove if already exists
      const filtered = recent.filter((r: { slug: string }) => r.slug !== course.slug)
      
      // Add to front
      filtered.unshift({
        slug: course.slug,
        title: metadata?.title || course.title,
        timestamp: Date.now()
      })
      
      // Keep only last 10
      const trimmed = filtered.slice(0, 10)
      
      localStorage.setItem('learnhub-recent-courses', JSON.stringify(trimmed))
    } catch {
      // Ignore localStorage errors
    }
  }

  const difficultyColor = {
    beginner: 'badge-beginner',
    intermediate: 'badge-intermediate',
    advanced: 'badge-advanced',
  }

  const difficulty = metadata?.difficulty?.value?.toLowerCase() || 'beginner'

  return (
    <Link 
      href={`/courses/${course.slug}`} 
      className="card group block"
      onClick={handleCourseClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-navy-800 overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📚
          </div>
        )}
        
        {/* Free Badge */}
        {metadata?.is_free && (
          <div className="absolute top-4 left-4 badge badge-free">
            Free
          </div>
        )}
        
        {/* Duration */}
        {metadata?.estimated_hours && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-navy-950/80 backdrop-blur-sm rounded text-sm text-white">
            {metadata.estimated_hours}h
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded"
              >
                {cat.metadata?.name || cat.title}
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <span className={`badge ${difficultyColor[difficulty as keyof typeof difficultyColor] || 'badge-beginner'}`}>
            {metadata?.difficulty?.value || 'Beginner'}
          </span>
          
          <span className="text-white font-semibold">
            {metadata?.is_free ? (
              'Free'
            ) : metadata?.price ? (
              `$${metadata.price}`
            ) : (
              'Free'
            )}
          </span>
        </div>

        {/* Instructor preview */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-navy-800">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url && (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0]?.metadata?.name || ''}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-navy-400">
              {metadata.instructors[0]?.metadata?.name || metadata.instructors[0]?.title}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}