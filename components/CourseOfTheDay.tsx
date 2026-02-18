'use client'

import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseOfTheDayProps {
  course: Course
}

export default function CourseOfTheDay({ course }: CourseOfTheDayProps) {
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []
  
  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-full">
          <span className="text-xl animate-bounce-slow">⭐</span>
          <span className="text-primary-400 font-semibold">Course of the Day</span>
          <span className="text-xl animate-bounce-slow" style={{ animationDelay: '150ms' }}>⭐</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      </div>
      
      {/* Course Card */}
      <Link 
        href={`/courses/${course.slug}`}
        className="block group"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Animated sparkles */}
          <div className="absolute top-4 right-4 text-2xl animate-sparkle">✨</div>
          <div className="absolute top-12 right-12 text-lg animate-sparkle" style={{ animationDelay: '200ms' }}>✨</div>
          <div className="absolute bottom-8 left-8 text-xl animate-sparkle" style={{ animationDelay: '400ms' }}>✨</div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Thumbnail */}
            <div className="lg:w-2/5 relative overflow-hidden">
              <div className="aspect-video lg:aspect-auto lg:h-full min-h-[250px]">
                {thumbnail ? (
                  <img
                    src={`${thumbnail.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                    <span className="text-7xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent lg:bg-gradient-to-r" />
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:w-3/5 p-8 lg:p-10 relative">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {metadata?.is_free ? (
                  <span className="badge badge-free text-sm">🎉 Free Course</span>
                ) : (
                  <span className="badge bg-primary-500/20 text-primary-400">
                    💰 ${metadata?.price || 0}
                  </span>
                )}
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                {course.title}
              </h3>
              
              {metadata?.tagline && (
                <p className="text-navy-300 text-lg mb-6 line-clamp-2">
                  {metadata.tagline}
                </p>
              )}
              
              {/* Course stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <span>{lessons.length} lessons</span>
                </div>
                {metadata?.estimated_hours && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span>{metadata.estimated_hours} hours</span>
                  </div>
                )}
              </div>
              
              {/* Instructor */}
              {instructors.length > 0 && instructors[0] && (
                <div className="flex items-center gap-4 pt-6 border-t border-navy-800">
                  {instructors[0].metadata?.photo ? (
                    <img
                      src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                      alt={instructors[0].metadata?.name || instructors[0].title}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl ring-2 ring-primary-500/30">
                      👨‍🏫
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {instructors[0].metadata?.name || instructors[0].title}
                    </div>
                    {instructors[0].metadata?.credentials && (
                      <div className="text-navy-400 text-sm line-clamp-1">
                        {instructors[0].metadata.credentials}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* CTA */}
              <div className="mt-6 flex items-center gap-4">
                <span className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Start Learning Today</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}