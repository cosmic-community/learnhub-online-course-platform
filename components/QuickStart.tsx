'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartProps {
  courses: Course[]
  freeCourses: Course[]
}

type FilterType = 'free' | 'beginner' | 'popular'

export default function QuickStart({ courses, freeCourses }: QuickStartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('free')

  const beginnerCourses = courses.filter(c => 
    c.metadata?.difficulty?.value?.toLowerCase() === 'beginner'
  )

  const popularCourses = courses.slice(0, 4) // Assuming first courses are most popular

  const getFilteredCourses = () => {
    switch (activeFilter) {
      case 'free':
        return freeCourses.slice(0, 4)
      case 'beginner':
        return beginnerCourses.slice(0, 4)
      case 'popular':
        return popularCourses
      default:
        return freeCourses.slice(0, 4)
    }
  }

  const filteredCourses = getFilteredCourses()

  const filters: { id: FilterType; label: string; emoji: string; count: number }[] = [
    { id: 'free', label: 'Free Courses', emoji: '🎁', count: freeCourses.length },
    { id: 'beginner', label: 'Beginner Friendly', emoji: '🌱', count: beginnerCourses.length },
    { id: 'popular', label: 'Most Popular', emoji: '🔥', count: popularCourses.length },
  ]

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Quick Start</h2>
        <p className="text-navy-400">Jump into learning with these handpicked courses</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeFilter === filter.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
            }`}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === filter.id
                ? 'bg-white/20'
                : 'bg-navy-700'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course, index) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group card p-4 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              {course.metadata?.thumbnail ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
              )}
              
              {/* Overlay Badge */}
              <div className="absolute top-2 right-2">
                {course.metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : (
                  <span className="badge bg-navy-900/90 text-white">
                    ${course.metadata?.price || 0}
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
              {course.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-navy-400">
              {course.metadata?.difficulty && (
                <span className="capitalize">{course.metadata.difficulty.value}</span>
              )}
              <span>•</span>
              <span>{course.metadata?.lessons?.length || 0} lessons</span>
            </div>

            {/* Progress indicator for visual appeal */}
            <div className="mt-4 h-1 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500 group-hover:w-full"
                style={{ width: '0%' }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <span className="text-5xl mb-4 block">📭</span>
          <p className="text-navy-400 mb-4">No courses found in this category</p>
          <Link href="/courses" className="btn-primary">
            Browse All Courses
          </Link>
        </div>
      )}

      {/* View All Link */}
      {filteredCourses.length > 0 && (
        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            View all {courses.length} courses
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}