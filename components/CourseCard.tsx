'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const [isHovered, setIsHovered] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const difficultyValue = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  const getDifficultyBadge = () => {
    const value = difficultyValue?.toLowerCase()
    switch (value) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'bg-navy-700 text-navy-200'
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    setShowSparkles(true)
    // Hide sparkles after animation
    setTimeout(() => setShowSparkles(false), 600)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <Link 
      href={`/courses/${course.slug}`} 
      className="card group block relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sparkle effect on hover */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-lg animate-ping"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDuration: '0.6s',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
      )}

      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {metadata?.is_free && (
            <span className="badge badge-free animate-pulse">Free</span>
          )}
          {difficultyValue && (
            <span className={`badge ${getDifficultyBadge()}`}>
              {difficultyValue}
            </span>
          )}
        </div>

        {/* Play button overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-16 bg-primary-500/90 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 transform transition-transform duration-300 hover:scale-110">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>

        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Course Meta */}
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
            {metadata?.lessons?.length ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            ) : null}
          </div>

          {/* Price */}
          <div className="font-semibold">
            {metadata?.is_free ? (
              <span className="text-primary-400">Free</span>
            ) : metadata?.price ? (
              <span className="text-white">${metadata.price}</span>
            ) : null}
          </div>
        </div>

        {/* Instructor preview */}
        {metadata?.instructors?.[0] && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-3">
            {metadata.instructors[0].metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || ''}
                className="w-8 h-8 rounded-full ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                <span className="text-sm">👨‍🏫</span>
              </div>
            )}
            <span className="text-sm text-navy-400">
              {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
            </span>
          </div>
        )}
      </div>

      {/* Hover border glow effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
        isHovered ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-transparent'
      }`} />
    </Link>
  )
}