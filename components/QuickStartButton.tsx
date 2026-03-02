'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartButtonProps {
  courses: Course[]
}

export default function QuickStartButton({ courses }: QuickStartButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [randomCourse, setRandomCourse] = useState<Course | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show button after a delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isExpanded && courses.length > 0) {
      const random = courses[Math.floor(Math.random() * courses.length)]
      setRandomCourse(random)
    }
  }, [isExpanded, courses])

  const handleShuffle = () => {
    if (courses.length > 0) {
      const random = courses[Math.floor(Math.random() * courses.length)]
      setRandomCourse(random)
    }
  }

  if (!isVisible || courses.length === 0) return null

  return (
    <div className="fixed bottom-24 right-5 z-40">
      {/* Expanded Panel */}
      {isExpanded && randomCourse && (
        <div className="absolute bottom-16 right-0 w-80 bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-primary-400 font-medium">🎲 Random Pick</span>
              <button 
                onClick={handleShuffle}
                className="text-navy-400 hover:text-white transition-colors p-1"
                aria-label="Get another suggestion"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {randomCourse.metadata?.thumbnail?.imgix_url && (
              <img 
                src={`${randomCourse.metadata.thumbnail.imgix_url}?w=640&h=360&fit=crop&auto=format,compress`}
                alt={randomCourse.metadata?.title || randomCourse.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            
            <h4 className="text-white font-semibold mb-1 line-clamp-1">
              {randomCourse.metadata?.title || randomCourse.title}
            </h4>
            
            {randomCourse.metadata?.tagline && (
              <p className="text-navy-400 text-sm mb-3 line-clamp-2">
                {randomCourse.metadata.tagline}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {randomCourse.metadata?.difficulty?.value && (
                  <span className={`badge badge-${randomCourse.metadata.difficulty.value.toLowerCase()}`}>
                    {randomCourse.metadata.difficulty.value}
                  </span>
                )}
                {randomCourse.metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
              </div>
              <Link 
                href={`/courses/${randomCourse.slug}`}
                className="btn-primary text-sm py-2 px-4"
              >
                Start Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          group flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300
          ${isExpanded 
            ? 'bg-navy-700 text-white' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
          }
        `}
        aria-label={isExpanded ? 'Close quick start' : 'Get a random course suggestion'}
      >
        {isExpanded ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">Close</span>
          </>
        ) : (
          <>
            <span className="text-xl animate-bounce-slow">🎯</span>
            <span className="font-medium">Quick Start</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}