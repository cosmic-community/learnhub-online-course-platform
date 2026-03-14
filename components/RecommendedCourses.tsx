'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface RecommendedCoursesProps {
  courses: Course[]
  categories: Category[]
}

function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

export default function RecommendedCourses({ courses, categories }: RecommendedCoursesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate personalization based on "user interests"
  // In a real app, this would come from user data/behavior
  const userInterests = ['Web Development', 'Cloud Computing']
  
  const recommendedCourses = courses
    .filter(course => {
      const courseCategories = course.metadata?.categories || []
      return courseCategories.some((cat: Category) => 
        userInterests.some(interest => 
          cat.metadata?.name?.toLowerCase().includes(interest.toLowerCase()) ||
          cat.title.toLowerCase().includes(interest.toLowerCase())
        )
      )
    })
    .slice(0, 4)

  // If not enough personalized recommendations, fill with popular courses
  const displayCourses = recommendedCourses.length >= 3 
    ? recommendedCourses 
    : [...recommendedCourses, ...courses.filter(c => !recommendedCourses.includes(c))].slice(0, 4)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getDifficultyColor = (difficulty: string): string => {
    const level = difficulty.toLowerCase()
    if (level === 'beginner') return 'text-green-400 bg-green-400/10'
    if (level === 'intermediate') return 'text-yellow-400 bg-yellow-400/10'
    if (level === 'advanced') return 'text-red-400 bg-red-400/10'
    return 'text-navy-400 bg-navy-400/10'
  }

  return (
    <div ref={containerRef} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✨</span>
            <h2 className="text-3xl font-bold text-white">Recommended For You</h2>
          </div>
          <p className="text-navy-400">
            Based on your interests in{' '}
            {userInterests.map((interest, i) => (
              <span key={interest}>
                <span className="text-primary-400">{interest}</span>
                {i < userInterests.length - 1 ? (i === userInterests.length - 2 ? ' and ' : ', ') : ''}
              </span>
            ))}
          </p>
        </div>
        
        {/* Category Quick Filters */}
        <div className="flex gap-2 mt-4 sm:mt-0 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === null 
                ? 'bg-primary-500 text-white' 
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            All
          </button>
          {categories.slice(0, 3).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                activeCategory === cat.id 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
              }`}
            >
              <span>{cat.metadata?.icon}</span>
              <span>{cat.metadata?.name || cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCourses.map((course, index) => {
          const thumbnail = course.metadata?.thumbnail?.imgix_url
          const difficulty = getMetafieldValue(course.metadata?.difficulty)
          const price = course.metadata?.price
          const isFree = course.metadata?.is_free
          const estimatedHours = course.metadata?.estimated_hours
          const lessonsCount = course.metadata?.lessons?.length || 0

          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className={`group relative card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Thumbnail with gradient overlay */}
              <div className="relative h-40 overflow-hidden">
                {thumbnail ? (
                  <img
                    src={`${thumbnail}?w=400&h=300&fit=crop&auto=format,compress`}
                    alt={course.metadata?.title || course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                
                {/* Match Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  hoveredCourse === course.id 
                    ? 'bg-primary-500 text-white scale-110' 
                    : 'bg-navy-900/80 text-primary-400'
                }`}>
                  {index === 0 ? '🎯 Best Match' : index === 1 ? '⭐ Popular' : '💡 Trending'}
                </div>

                {/* Price/Free Badge */}
                <div className="absolute bottom-3 left-3">
                  {isFree ? (
                    <span className="badge badge-free text-xs">FREE</span>
                  ) : price ? (
                    <span className="bg-white/90 text-navy-900 px-2 py-1 rounded text-sm font-bold">
                      ${price}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {difficulty && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {course.metadata?.title || course.title}
                </h3>
                
                <p className="text-sm text-navy-400 mb-3 line-clamp-2">
                  {course.metadata?.tagline || ''}
                </p>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-xs text-navy-500">
                  {lessonsCount > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{lessonsCount} lessons</span>
                    </div>
                  )}
                  {estimatedHours && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{estimatedHours}h</span>
                    </div>
                  )}
                </div>

                {/* Progress bar for hover effect */}
                <div className={`mt-4 h-1 bg-navy-800 rounded-full overflow-hidden transition-all duration-300 ${
                  hoveredCourse === course.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: hoveredCourse === course.id ? '100%' : '0%' }}
                  />
                </div>
              </div>

              {/* Hover CTA */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-900 via-navy-900/95 to-transparent transition-all duration-300 ${
                hoveredCourse === course.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <span className="inline-flex items-center gap-2 text-primary-400 font-medium text-sm">
                  Start Learning
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* See More Link */}
      <div className="mt-8 text-center">
        <Link 
          href="/courses" 
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group"
        >
          <span>View all {courses.length} courses</span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}