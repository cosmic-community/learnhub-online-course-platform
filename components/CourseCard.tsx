'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showBookmarkAnimation, setShowBookmarkAnimation] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-user-stats')
    if (stored) {
      const stats = JSON.parse(stored)
      setIsBookmarked(stats.bookmarkedCourses?.includes(course.id) ?? false)
    }
  }, [course.id])

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const stored = localStorage.getItem('learnhub-user-stats')
    const stats = stored ? JSON.parse(stored) : { bookmarkedCourses: [], viewedCourses: [], completedLessons: [] }
    
    if (isBookmarked) {
      stats.bookmarkedCourses = stats.bookmarkedCourses.filter((id: string) => id !== course.id)
    } else {
      stats.bookmarkedCourses.push(course.id)
      setShowBookmarkAnimation(true)
      setTimeout(() => setShowBookmarkAnimation(false), 600)
    }
    
    localStorage.setItem('learnhub-user-stats', JSON.stringify(stats))
    setIsBookmarked(!isBookmarked)
  }

  const handleCardClick = () => {
    // Track viewed courses
    const stored = localStorage.getItem('learnhub-user-stats')
    const stats = stored ? JSON.parse(stored) : { bookmarkedCourses: [], viewedCourses: [], completedLessons: [] }
    
    if (!stats.viewedCourses.includes(course.id)) {
      stats.viewedCourses.push(course.id)
      localStorage.setItem('learnhub-user-stats', JSON.stringify(stats))
    }
  }

  const getDifficultyBadge = () => {
    const difficulty = metadata?.difficulty?.value?.toLowerCase() ?? 'beginner'
    const badges: Record<string, string> = {
      beginner: 'badge-beginner',
      intermediate: 'badge-intermediate',
      advanced: 'badge-advanced',
    }
    return badges[difficulty] ?? 'badge-beginner'
  }

  const instructors = metadata?.instructors ?? []
  const categories = metadata?.categories ?? []
  const lessons = metadata?.lessons ?? []

  return (
    <div className="card group relative">
      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isBookmarked 
            ? 'bg-yellow-500 text-navy-900 shadow-lg shadow-yellow-500/30' 
            : 'bg-navy-800/80 text-navy-400 hover:bg-navy-700 hover:text-white'
        } ${showBookmarkAnimation ? 'scale-125' : ''}`}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <svg 
          className={`w-5 h-5 transition-transform ${showBookmarkAnimation ? 'animate-bounce' : ''}`} 
          fill={isBookmarked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
          />
        </svg>
      </button>

      <Link href={`/courses/${course.slug}`} className="block" onClick={handleCardClick}>
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {metadata?.thumbnail?.imgix_url ? (
            <img
              src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
              alt={metadata?.title ?? course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
              <span className="text-6xl opacity-50">📚</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className={`badge ${getDifficultyBadge()}`}>
              {metadata?.difficulty?.value ?? 'Beginner'}
            </span>
            {metadata?.is_free && (
              <span className="badge badge-free">Free</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              {categories.slice(0, 2).map((cat) => (
                <span key={cat.id} className="text-xs text-primary-400">
                  {cat.metadata?.icon} {cat.metadata?.name ?? cat.title}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
            {metadata?.title ?? course.title}
          </h3>
          
          {metadata?.tagline && (
            <p className="text-navy-400 text-sm mb-4 line-clamp-2">
              {metadata.tagline}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-navy-400">
              {lessons.length > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
              )}
              {metadata?.estimated_hours && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours}h
                </span>
              )}
            </div>
            
            {!metadata?.is_free && metadata?.price && (
              <span className="font-semibold text-white">${metadata.price}</span>
            )}
          </div>

          {/* Instructors */}
          {instructors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-2">
              <div className="flex -space-x-2">
                {instructors.slice(0, 3).map((instructor) => (
                  <div key={instructor.id} className="w-8 h-8 rounded-full border-2 border-navy-900 overflow-hidden">
                    {instructor.metadata?.photo?.imgix_url ? (
                      <img
                        src={`${instructor.metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                        alt={instructor.metadata?.name ?? instructor.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500/20 flex items-center justify-center text-xs text-primary-400">
                        {(instructor.metadata?.name ?? instructor.title)?.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs text-navy-400">
                {instructors.length === 1 
                  ? instructors[0]?.metadata?.name ?? instructors[0]?.title
                  : `${instructors.length} instructors`}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}