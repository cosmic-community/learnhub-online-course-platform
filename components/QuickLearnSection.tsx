'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickLearnSectionProps {
  courses: Course[]
}

type TimeOption = '15' | '30' | '60' | 'any'

export default function QuickLearnSection({ courses }: QuickLearnSectionProps) {
  const [selectedTime, setSelectedTime] = useState<TimeOption>('30')
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const timeOptions: { value: TimeOption; label: string; emoji: string }[] = [
    { value: '15', label: '15 mins', emoji: '☕' },
    { value: '30', label: '30 mins', emoji: '📖' },
    { value: '60', label: '1 hour', emoji: '💻' },
    { value: 'any', label: 'All day', emoji: '🚀' },
  ]

  // Filter courses based on time and get recommendations
  const getRecommendedCourses = () => {
    const maxHours = selectedTime === 'any' ? 999 : parseInt(selectedTime) / 60
    
    // Get courses that fit the time slot
    const filteredCourses = courses.filter(course => {
      const hours = course.metadata?.estimated_hours || 0
      if (selectedTime === 'any') return true
      // For quick learn, we want courses with at least one lesson that fits
      const avgLessonTime = hours / (course.metadata?.lessons?.length || 1)
      return avgLessonTime <= maxHours * 2 // A bit of flexibility
    })

    // Prioritize free courses and shorter ones for quick sessions
    return filteredCourses
      .sort((a, b) => {
        if (a.metadata?.is_free && !b.metadata?.is_free) return -1
        if (!a.metadata?.is_free && b.metadata?.is_free) return 1
        return (a.metadata?.estimated_hours || 0) - (b.metadata?.estimated_hours || 0)
      })
      .slice(0, 3)
  }

  const recommendedCourses = getRecommendedCourses()

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-2xl">⏰</span>
          <h2 className="text-2xl font-bold text-white">Quick Learn</h2>
        </div>
        <p className="text-navy-400">How much time do you have?</p>
      </div>

      {/* Time Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedTime(option.value)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedTime === option.value
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
            }`}
          >
            <span className="text-lg">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Course Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedCourses.map((course, index) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group relative"
            onMouseEnter={() => setIsHovered(course.id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className={`card p-5 h-full transition-all duration-300 ${
              isHovered === course.id ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : ''
            }`}>
              {/* Course number badge */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Thumbnail */}
              {course.metadata?.thumbnail && (
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                    alt={course.metadata?.title || course.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered === course.id ? 'scale-110' : ''
                    }`}
                  />
                  {course.metadata?.is_free && (
                    <div className="absolute top-2 right-2 badge badge-free text-xs">
                      Free
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                {course.metadata?.title || course.title}
              </h3>
              
              <p className="text-navy-400 text-sm mb-3 line-clamp-2">
                {course.metadata?.tagline}
              </p>

              {/* Meta info */}
              <div className="flex items-center justify-between text-sm">
                <span className={`badge ${
                  course.metadata?.difficulty?.value === 'Beginner' ? 'badge-beginner' :
                  course.metadata?.difficulty?.value === 'Intermediate' ? 'badge-intermediate' :
                  'badge-advanced'
                }`}>
                  {course.metadata?.difficulty?.value || 'Beginner'}
                </span>
                <span className="text-navy-400 flex items-center gap-1">
                  <span>⏱️</span>
                  {course.metadata?.estimated_hours || 0}h
                </span>
              </div>

              {/* Hover arrow */}
              <div className={`absolute bottom-5 right-5 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white transform transition-all duration-300 ${
                isHovered === course.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recommendedCourses.length === 0 && (
        <div className="text-center py-10">
          <p className="text-navy-400">No courses found for this time slot. Try a different option!</p>
        </div>
      )}
    </div>
  )
}