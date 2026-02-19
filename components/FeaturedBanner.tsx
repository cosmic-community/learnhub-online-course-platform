'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface FeaturedBannerProps {
  courses: Course[]
}

export default function FeaturedBanner({ courses }: FeaturedBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (courses.length <= 1) return

    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % courses.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(timer)
  }, [courses.length])

  if (courses.length === 0) return null

  const currentCourse = courses[currentIndex]
  if (!currentCourse) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20 border border-primary-500/20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]" />
      </div>

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Left side - Content */}
          <div className={`flex-1 transition-all duration-300 ${isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-xs font-medium rounded-full animate-pulse">
                ✨ Featured Course
              </span>
              {currentCourse.metadata?.is_free && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                  FREE
                </span>
              )}
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {currentCourse.title}
            </h3>
            
            <p className="text-navy-300 mb-4 line-clamp-2">
              {currentCourse.metadata?.tagline || 'Start your learning journey today'}
            </p>

            <div className="flex items-center gap-4 mb-4">
              {currentCourse.metadata?.instructors?.[0] && (
                <div className="flex items-center gap-2">
                  {currentCourse.metadata.instructors[0].metadata?.photo ? (
                    <img
                      src={`${currentCourse.metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm">
                      👨‍🏫
                    </div>
                  )}
                  <span className="text-navy-400 text-sm">
                    by {currentCourse.metadata.instructors[0].metadata?.name || currentCourse.metadata.instructors[0].title}
                  </span>
                </div>
              )}
              
              {currentCourse.metadata?.lessons && (
                <span className="text-navy-400 text-sm">
                  📖 {currentCourse.metadata.lessons.length} lessons
                </span>
              )}
            </div>

            <Link
              href={`/courses/${currentCourse.slug}`}
              className="btn-primary inline-flex"
            >
              Start Learning →
            </Link>
          </div>

          {/* Right side - Image */}
          <div className={`lg:w-1/3 transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            {currentCourse.metadata?.thumbnail ? (
              <img
                src={`${currentCourse.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                alt={currentCourse.title}
                className="w-full aspect-video rounded-xl object-cover shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center shadow-2xl">
                <span className="text-6xl">📚</span>
              </div>
            )}
          </div>
        </div>

        {/* Pagination dots */}
        {courses.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsAnimating(false)
                  }, 300)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-6 bg-primary-500' 
                    : 'bg-navy-600 hover:bg-navy-500'
                }`}
                aria-label={`Go to course ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}