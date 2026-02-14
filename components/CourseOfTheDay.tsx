'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseOfTheDayProps {
  course: Course
}

export default function CourseOfTheDay({ course }: CourseOfTheDayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []
  const instructor = instructors[0]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full">
          <span className="text-2xl animate-bounce-slow">⭐</span>
          <span className="text-amber-400 font-semibold">Course of the Day</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 to-transparent" />
      </div>
      
      <Link href={`/courses/${course.slug}`} className="group block">
        <div className="card overflow-hidden bg-gradient-to-br from-navy-900/80 to-navy-900/40 border-amber-500/20 hover:border-amber-500/40 transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative aspect-video md:aspect-auto overflow-hidden">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-900/80 md:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent md:hidden" />
              
              {/* Sparkle effects */}
              <div className="absolute top-4 left-4 text-2xl animate-pulse">✨</div>
              <div className="absolute bottom-4 right-4 text-xl animate-pulse delay-300">✨</div>
            </div>
            
            {/* Content Side */}
            <div className="p-8 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                {metadata?.is_free ? (
                  <span className="badge badge-free">Free</span>
                ) : (
                  <span className="badge bg-amber-500/20 text-amber-400 font-bold">
                    ${metadata?.price || 0}
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                {course.title}
              </h3>
              
              {metadata?.tagline && (
                <p className="text-navy-300 text-lg mb-6 line-clamp-2">
                  {metadata.tagline}
                </p>
              )}
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-navy-400 mb-6">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>
                
                {metadata?.estimated_hours && (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
              </div>
              
              {/* Instructor */}
              {instructor && (
                <div className="flex items-center gap-3 p-4 bg-navy-800/50 rounded-xl mb-6">
                  {instructor.metadata?.photo ? (
                    <img
                      src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                      alt={instructor.metadata?.name || instructor.title}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl ring-2 ring-amber-500/30">
                      👨‍🏫
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {instructor.metadata?.name || instructor.title}
                    </div>
                    {instructor.metadata?.credentials && (
                      <div className="text-navy-400 text-sm line-clamp-1">
                        {instructor.metadata.credentials}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="inline-flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-3 transition-all">
                <span>Start Learning Today</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}