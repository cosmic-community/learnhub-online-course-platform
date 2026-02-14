'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseSpotlightProps {
  courses: Course[]
}

export default function CourseSpotlight({ courses }: CourseSpotlightProps) {
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (courses.length <= 1) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setSpotlightIndex((prev) => (prev + 1) % courses.length)
        setIsVisible(true)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [courses.length])

  if (courses.length === 0) return null

  const course = courses[spotlightIndex]
  if (!course) return null

  const thumbnail = course.metadata?.thumbnail

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-950 border border-primary-500/20">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 animate-pulse" />
      
      {/* Spotlight badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-primary-500/90 rounded-full text-sm font-semibold text-white shadow-lg shadow-primary-500/30">
        <span className="animate-pulse">✨</span>
        Course Spotlight
      </div>

      <div className={`relative flex flex-col md:flex-row gap-6 p-6 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Thumbnail */}
        <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden group">
          {thumbnail ? (
            <img
              src={`${thumbnail.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          {course.metadata?.tagline && (
            <p className="text-navy-300 mb-4 line-clamp-2">
              {course.metadata.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {course.metadata?.difficulty && (
              <span className={`badge ${
                course.metadata.difficulty.value === 'Beginner' ? 'badge-beginner' :
                course.metadata.difficulty.value === 'Intermediate' ? 'badge-intermediate' :
                'badge-advanced'
              }`}>
                {course.metadata.difficulty.value}
              </span>
            )}
            
            {course.metadata?.lessons && course.metadata.lessons.length > 0 && (
              <span className="text-navy-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {course.metadata.lessons.length} lessons
              </span>
            )}

            {course.metadata?.is_free ? (
              <span className="badge badge-free">Free</span>
            ) : course.metadata?.price ? (
              <span className="text-white font-semibold">${course.metadata.price}</span>
            ) : null}
          </div>

          <Link 
            href={`/courses/${course.slug}`} 
            className="btn-primary w-fit group"
          >
            Start Learning
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Progress indicators */}
      {courses.length > 1 && (
        <div className="flex justify-center gap-2 pb-4">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  setSpotlightIndex(index)
                  setIsVisible(true)
                }, 300)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === spotlightIndex 
                  ? 'w-6 bg-primary-500' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`View course ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}