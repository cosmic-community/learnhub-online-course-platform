'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  courses: Course[]
}

export default function CourseSpotlight({ courses }: CourseSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (courses.length <= 1) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % courses.length)
        setIsAnimating(false)
      }, 300)
    }, 8000)

    return () => clearInterval(interval)
  }, [courses.length])

  if (courses.length === 0) return null

  const course = courses[currentIndex]
  if (!course) return null

  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const lessons = metadata?.lessons || []

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900/80 to-navy-800/50 border border-navy-700/50 backdrop-blur-sm">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary-600/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative grid md:grid-cols-2 gap-8 p-8 lg:p-12">
        {/* Content */}
        <div className={`flex flex-col justify-center transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Today&apos;s Spotlight
            </span>
            {metadata?.is_free && (
              <span className="badge badge-free">Free</span>
            )}
          </div>

          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {course.title}
          </h2>

          {metadata?.tagline && (
            <p className="text-navy-300 text-lg mb-6 line-clamp-2">
              {metadata.tagline}
            </p>
          )}

          {/* Course Stats */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {metadata?.difficulty && (
              <DifficultyBadge difficulty={metadata.difficulty} />
            )}
            <span className="flex items-center gap-1.5 text-navy-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {lessons.length} lessons
            </span>
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1.5 text-navy-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
          </div>

          {/* Instructor */}
          {instructors.length > 0 && instructors[0] && (
            <div className="flex items-center gap-3 mb-8">
              {instructors[0].metadata?.photo ? (
                <img
                  src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                  alt={instructors[0].metadata?.name || instructors[0].title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl ring-2 ring-primary-500/30">
                  👨‍🏫
                </div>
              )}
              <div>
                <p className="text-white font-medium">
                  {instructors[0].metadata?.name || instructors[0].title}
                </p>
                {instructors[0].metadata?.credentials && (
                  <p className="text-navy-400 text-sm line-clamp-1">
                    {instructors[0].metadata.credentials}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/courses/${course.slug}`} className="btn-primary">
              Start Learning
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            {!metadata?.is_free && metadata?.price && (
              <span className="inline-flex items-center justify-center px-6 py-3 text-2xl font-bold text-white">
                ${metadata.price}
              </span>
            )}
          </div>
        </div>

        {/* Image */}
        <div className={`relative transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10">
            {thumbnail ? (
              <img
                src={`${thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent flex items-center justify-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform transition-transform group-hover:scale-110">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-400/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Navigation dots */}
      {courses.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {courses.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary-500' 
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`Go to course ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}