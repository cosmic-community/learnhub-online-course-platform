'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  course: Course
}

export default function CourseSpotlight({ course }: CourseSpotlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []
  const categories = metadata?.categories || []

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div 
      className={`card overflow-hidden transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className="relative aspect-video md:aspect-auto overflow-hidden group">
          {thumbnail ? (
            <img
              src={`${thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
              <span className="text-8xl animate-bounce-slow">📚</span>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent md:bg-gradient-to-r" />
          
          {/* Play button overlay */}
          {metadata?.preview_video_url && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-20 h-20 bg-primary-500/90 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Price badge */}
          <div className="absolute top-4 left-4">
            {metadata?.is_free ? (
              <span className="badge badge-free text-lg px-4 py-2">Free</span>
            ) : (
              <span className="badge bg-navy-900/90 text-white text-lg px-4 py-2">
                ${metadata?.price || 0}
              </span>
            )}
          </div>
        </div>

        {/* Content Side */}
        <div className="p-8 flex flex-col justify-center">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="text-sm text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full"
                >
                  {category.metadata?.icon} {category.metadata?.name || category.title}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            {course.title}
          </h3>

          {metadata?.tagline && (
            <p className="text-navy-300 text-lg mb-6">
              {metadata.tagline}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400 mb-6">
            {metadata?.difficulty && (
              <DifficultyBadge difficulty={metadata.difficulty} />
            )}
            
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessons.length} lessons
            </span>
            
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours} hours
              </span>
            )}
          </div>

          {/* Instructor */}
          {instructors.length > 0 && instructors[0] && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-navy-800/50 rounded-xl">
              {instructors[0].metadata?.photo ? (
                <img
                  src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                  alt={instructors[0].metadata?.name || instructors[0].title}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                  👨‍🏫
                </div>
              )}
              <div>
                <p className="text-white font-medium">
                  {instructors[0].metadata?.name || instructors[0].title}
                </p>
                {instructors[0].metadata?.credentials && (
                  <p className="text-navy-400 text-sm">
                    {instructors[0].metadata.credentials}
                  </p>
                )}
              </div>
            </div>
          )}

          <Link 
            href={`/courses/${course.slug}`} 
            className="btn-primary text-lg w-full sm:w-auto text-center group"
          >
            Start Learning
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}