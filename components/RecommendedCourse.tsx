'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RecommendedCourseProps {
  courses: Course[]
}

export default function RecommendedCourse({ courses }: RecommendedCourseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const recommendedCourses = courses.slice(0, 3)

  useEffect(() => {
    if (recommendedCourses.length <= 1) return
    
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recommendedCourses.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [recommendedCourses.length])

  if (recommendedCourses.length === 0) return null

  const course = recommendedCourses[currentIndex]
  if (!course) return null

  const { metadata } = course

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Sparkle decoration */}
      <div className="absolute top-4 right-4 text-2xl animate-pulse">✨</div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💡</span>
        <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
      </div>

      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <Link href={`/courses/${course.slug}`} className="group block">
          <div className="flex gap-4">
            {metadata?.thumbnail ? (
              <img
                src={`${metadata.thumbnail.imgix_url}?w=200&h=120&fit=crop&auto=format,compress`}
                alt={course.title}
                className="w-24 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-24 h-16 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📚</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors line-clamp-1">
                {course.title}
              </h4>
              <p className="text-navy-400 text-sm line-clamp-2 mt-1">
                {metadata?.tagline || 'Start learning today!'}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Dots indicator */}
      {recommendedCourses.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {recommendedCourses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary-500 w-6' : 'bg-navy-700 hover:bg-navy-600'
              }`}
              aria-label={`Go to recommendation ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}