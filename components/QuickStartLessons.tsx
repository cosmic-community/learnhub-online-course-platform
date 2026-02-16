'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Lesson, Course } from '@/types'

interface QuickStartLessonsProps {
  lessons: Lesson[]
  courses: Course[]
}

export default function QuickStartLessons({ lessons, courses }: QuickStartLessonsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Find which course each lesson belongs to
  const getLessonCourse = (lessonId: string): Course | undefined => {
    return courses.find(course => 
      course.metadata?.lessons?.some(l => l.id === lessonId)
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-2xl font-bold text-white">Quick Start</h2>
          </div>
          <p className="text-navy-400">Jump right in with these popular lessons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {lessons.map((lesson, index) => {
          const course = getLessonCourse(lesson.id)
          const duration = lesson.metadata?.duration_minutes
          
          return (
            <Link
              key={lesson.id}
              href={course ? `/courses/${course.slug}/lessons/${lesson.slug}` : '#'}
              className={`group relative p-5 rounded-xl bg-navy-800/50 border border-navy-700 transition-all duration-300 hover:border-primary-500/50 hover:bg-navy-800 ${
                hoveredIndex === index ? 'scale-[1.02] shadow-lg shadow-primary-500/10' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Play icon overlay */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                <svg 
                  className="w-5 h-5 text-primary-400 transform group-hover:scale-110 transition-transform" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Lesson number badge */}
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-navy-700/50 rounded-md text-xs text-navy-400 mb-3">
                <span className="font-mono">#{(lesson.metadata?.order || index + 1).toString().padStart(2, '0')}</span>
              </div>

              <h3 className="text-white font-semibold mb-2 pr-12 line-clamp-2 group-hover:text-primary-400 transition-colors">
                {lesson.metadata?.title || lesson.title}
              </h3>

              {lesson.metadata?.description && (
                <p className="text-navy-400 text-sm mb-3 line-clamp-2">
                  {lesson.metadata.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-navy-500">
                {duration && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {duration} min
                  </span>
                )}
                
                {course && (
                  <span className="flex items-center gap-1 text-primary-400/70">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {course.title}
                  </span>
                )}
              </div>

              {/* Progress bar decoration */}
              <div className="mt-4 h-1 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ width: hoveredIndex === index ? '100%' : '0%' }}
                />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <Link href="/courses" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium">
          <span>View all lessons</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}