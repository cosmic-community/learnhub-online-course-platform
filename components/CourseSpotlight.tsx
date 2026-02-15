'use client'

import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  return (
    <div className="relative">
      {/* Spotlight label */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="animate-pulse">✨</span>
        <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">
          Course Spotlight
        </span>
        <span className="animate-pulse">✨</span>
      </div>
      
      <Link 
        href={`/courses/${course.slug}`}
        className="group block relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-800/50 to-navy-900/50 border border-primary-500/30 hover:border-primary-400/50 transition-all duration-500"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div className="md:w-1/3 relative">
            {thumbnail ? (
              <img
                src={`${thumbnail.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                alt={course.title}
                className="w-full h-48 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 md:h-full bg-gradient-to-br from-primary-600/20 to-primary-800/20 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
            
            {/* Glowing badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-primary-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary-500/50 animate-pulse">
                🌟 Today&apos;s Pick
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {course.title}
            </h3>
            
            {metadata?.tagline && (
              <p className="text-navy-300 mb-4 line-clamp-2">
                {metadata.tagline}
              </p>
            )}
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {metadata?.difficulty && (
                <DifficultyBadge difficulty={metadata.difficulty} />
              )}
              
              <span className="flex items-center gap-1 text-navy-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {lessons.length} lessons
              </span>
              
              {metadata?.estimated_hours && (
                <span className="flex items-center gap-1 text-navy-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata.estimated_hours}h
                </span>
              )}
              
              {/* Price */}
              <span className="ml-auto">
                {metadata?.is_free ? (
                  <span className="badge badge-free text-lg">Free</span>
                ) : (
                  <span className="text-2xl font-bold text-primary-400">
                    ${metadata?.price || 0}
                  </span>
                )}
              </span>
            </div>
            
            {/* Instructor */}
            {instructors.length > 0 && instructors[0] && (
              <div className="flex items-center gap-3 pt-4 border-t border-navy-700">
                {instructors[0].metadata?.photo ? (
                  <img
                    src={`${instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={instructors[0].metadata?.name || instructors[0].title}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
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
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                Explore Course
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}