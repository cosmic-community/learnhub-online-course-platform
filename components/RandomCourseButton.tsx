'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RandomCourseButtonProps {
  courses: Course[]
}

export default function RandomCourseButton({ courses }: RandomCourseButtonProps) {
  const [randomCourse, setRandomCourse] = useState<Course | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSurpriseMe = () => {
    if (courses.length === 0) return

    setIsAnimating(true)
    
    // Shuffle animation effect
    let count = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setRandomCourse(courses[randomIndex] ?? null)
      count++
      
      if (count > 10) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 100)
  }

  const closeModal = () => {
    setRandomCourse(null)
    setIsAnimating(false)
  }

  return (
    <>
      <button
        onClick={handleSurpriseMe}
        disabled={isAnimating}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className={isAnimating ? 'animate-spin' : 'group-hover:animate-wiggle'}>🎲</span>
          {isAnimating ? 'Finding...' : 'Surprise Me!'}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Random Course Modal */}
      {randomCourse && !isAnimating && (
        <>
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-navy-900 border border-navy-700 rounded-2xl max-w-md w-full overflow-hidden animate-bounce-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with confetti effect */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-2xl animate-float"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    >
                      ✨
                    </span>
                  ))}
                </div>
                <div className="text-5xl mb-2">🎉</div>
                <h3 className="text-2xl font-bold text-white">We Found One!</h3>
                <p className="text-white/80">Here&apos;s a course you might love</p>
              </div>

              {/* Course Preview */}
              <div className="p-6">
                {randomCourse.metadata?.thumbnail && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={`${randomCourse.metadata.thumbnail.imgix_url}?w=600&h=340&fit=crop&auto=format,compress`}
                      alt={randomCourse.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="text-xl font-bold text-white mb-2">{randomCourse.title}</h4>
                
                {randomCourse.metadata?.tagline && (
                  <p className="text-navy-400 mb-4">{randomCourse.metadata.tagline}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-navy-400 mb-6">
                  {randomCourse.metadata?.difficulty && (
                    <span className={`badge ${
                      randomCourse.metadata.difficulty.value === 'Beginner' ? 'badge-beginner' :
                      randomCourse.metadata.difficulty.value === 'Intermediate' ? 'badge-intermediate' :
                      'badge-advanced'
                    }`}>
                      {randomCourse.metadata.difficulty.value}
                    </span>
                  )}
                  {randomCourse.metadata?.is_free && (
                    <span className="badge badge-free">Free</span>
                  )}
                  {randomCourse.metadata?.estimated_hours && (
                    <span>{randomCourse.metadata.estimated_hours}h course</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/courses/${randomCourse.slug}`}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors"
                  >
                    View Course
                  </Link>
                  <button
                    onClick={handleSurpriseMe}
                    className="bg-navy-800 hover:bg-navy-700 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-navy-700"
                  >
                    🎲 Try Again
                  </button>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}