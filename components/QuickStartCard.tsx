'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [randomCourse, setRandomCourse] = useState<Course | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    if (courses.length > 0) {
      const random = courses[Math.floor(Math.random() * courses.length)]
      setRandomCourse(random)
    }
  }, [courses])

  const shuffleCourse = () => {
    if (courses.length <= 1) return
    
    setIsSpinning(true)
    
    // Quick shuffle animation
    let shuffleCount = 0
    const shuffleInterval = setInterval(() => {
      const random = courses[Math.floor(Math.random() * courses.length)]
      setRandomCourse(random)
      shuffleCount++
      
      if (shuffleCount >= 8) {
        clearInterval(shuffleInterval)
        setIsSpinning(false)
      }
    }, 100)
  }

  if (!randomCourse) return null

  const { metadata } = randomCourse
  const thumbnail = metadata?.thumbnail

  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-2xl border border-navy-800 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <h3 className="text-lg font-semibold text-white">Quick Start</h3>
          </div>
          <button
            onClick={shuffleCourse}
            disabled={isSpinning}
            className="px-3 py-1.5 text-sm bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Shuffle
          </button>
        </div>

        <p className="text-navy-400 text-sm mb-4">
          Not sure where to start? Here's a course picked just for you:
        </p>
      </div>

      <Link 
        href={`/courses/${randomCourse.slug}`}
        className={`block transition-all duration-300 ${isSpinning ? 'opacity-50 scale-95' : 'hover:bg-navy-800/50'}`}
      >
        <div className="flex gap-4 p-4 border-t border-navy-800">
          {/* Thumbnail */}
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            {thumbnail ? (
              <img
                src={`${thumbnail.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                alt={randomCourse.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium mb-1 truncate group-hover:text-primary-400 transition-colors">
              {randomCourse.title}
            </h4>
            {metadata?.tagline && (
              <p className="text-navy-400 text-sm mb-2 line-clamp-2">
                {metadata.tagline}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-navy-500">
              {metadata?.difficulty && (
                <span className={`px-2 py-0.5 rounded-full ${
                  metadata.difficulty.value === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  metadata.difficulty.value === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {metadata.difficulty.value}
                </span>
              )}
              {metadata?.estimated_hours && (
                <span>{metadata.estimated_hours}h</span>
              )}
              {metadata?.is_free && (
                <span className="text-primary-400 font-medium">FREE</span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center text-navy-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}