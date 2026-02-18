'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseSpotlightProps {
  courses: Course[]
}

export default function CourseSpotlight({ courses }: CourseSpotlightProps) {
  const [spotlightCourse, setSpotlightCourse] = useState<Course | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (courses.length > 0) {
      // Pick a random course for the spotlight
      const randomIndex = Math.floor(Math.random() * courses.length)
      setSpotlightCourse(courses[randomIndex] ?? null)
      
      // Animate in
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    }
  }, [courses])

  const handleExplore = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  if (!spotlightCourse) return null

  const { metadata } = spotlightCourse
  const instructors = metadata?.instructors || []

  return (
    <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '⭐', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900/90 to-primary-500/10 border border-navy-700">
        {/* Animated background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl animate-spin-slow" />
        </div>

        {/* Spotlight badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm">
            <span className="animate-pulse">🌟</span>
            <span className="text-sm font-semibold text-yellow-400">Course Spotlight</span>
          </div>
        </div>

        <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              {metadata?.difficulty && (
                <DifficultyBadge difficulty={metadata.difficulty} size="default" />
              )}
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {spotlightCourse.title}
            </h3>
            
            {metadata?.tagline && (
              <p className="text-lg text-navy-300 mb-6">
                {metadata.tagline}
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-navy-400">
              {metadata?.estimated_hours && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <span>{metadata.estimated_hours} hours</span>
                </div>
              )}
              {metadata?.lessons && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <span>{metadata.lessons.length} lessons</span>
                </div>
              )}
              {metadata?.is_free ? (
                <div className="flex items-center gap-2 text-primary-400">
                  <span className="text-xl">🎁</span>
                  <span className="font-semibold">Free Course!</span>
                </div>
              ) : metadata?.price ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="font-semibold text-white">${metadata.price}</span>
                </div>
              ) : null}
            </div>

            {/* Instructor */}
            {instructors.length > 0 && instructors[0] && (
              <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-navy-800/50 backdrop-blur-sm">
                {instructors[0].metadata?.photo ? (
                  <img
                    src={`${instructors[0].metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                    alt={instructors[0].metadata?.name || instructors[0].title}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                    👨‍🏫
                  </div>
                )}
                <div>
                  <div className="text-sm text-navy-400">Taught by</div>
                  <div className="font-semibold text-white">
                    {instructors[0].metadata?.name || instructors[0].title}
                  </div>
                </div>
              </div>
            )}

            <Link
              href={`/courses/${spotlightCourse.slug}`}
              onClick={handleExplore}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 group"
            >
              Explore This Course
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {metadata?.thumbnail ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                  alt={spotlightCourse.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 text-4xl animate-bounce">
                🎓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}