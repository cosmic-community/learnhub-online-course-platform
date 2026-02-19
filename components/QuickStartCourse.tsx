'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartCourseProps {
  courses: Course[]
}

export default function QuickStartCourse({ courses }: QuickStartCourseProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showCourse, setShowCourse] = useState(false)

  const spinForCourse = () => {
    if (courses.length === 0) return
    
    setIsSpinning(true)
    setShowCourse(false)
    
    // Simulate a "wheel spinning" effect
    let spins = 0
    const maxSpins = 15
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setSelectedCourse(courses[randomIndex] ?? null)
      spins++
      
      if (spins >= maxSpins) {
        clearInterval(interval)
        setIsSpinning(false)
        setShowCourse(true)
      }
    }, 100)
  }

  useEffect(() => {
    // Auto-select a random course on mount
    if (courses.length > 0) {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setSelectedCourse(courses[randomIndex] ?? null)
      setShowCourse(true)
    }
  }, [courses])

  if (courses.length === 0) return null

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-white">Quick Start</h3>
          </div>
          <button
            onClick={spinForCourse}
            disabled={isSpinning}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
              isSpinning 
                ? 'bg-navy-700 text-navy-400 cursor-not-allowed' 
                : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Picking...
              </span>
            ) : (
              '🎲 Surprise me!'
            )}
          </button>
        </div>
        
        <p className="text-sm text-navy-400 mb-4">
          Not sure where to start? Here&apos;s a course picked just for you!
        </p>
        
        {selectedCourse && (
          <Link 
            href={`/courses/${selectedCourse.slug}`}
            className={`block p-4 bg-navy-800/50 rounded-xl border border-navy-700 hover:border-primary-500/50 transition-all duration-500 ${
              showCourse ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'
            } ${isSpinning ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-start gap-4">
              {selectedCourse.metadata?.thumbnail ? (
                <img
                  src={`${selectedCourse.metadata.thumbnail.imgix_url}?w=160&h=90&fit=crop&auto=format,compress`}
                  alt={selectedCourse.title}
                  className="w-20 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-12 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-white truncate">{selectedCourse.title}</h4>
                {selectedCourse.metadata?.tagline && (
                  <p className="text-sm text-navy-400 truncate mt-0.5">{selectedCourse.metadata.tagline}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {selectedCourse.metadata?.is_free ? (
                    <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full">Free</span>
                  ) : (
                    <span className="text-xs text-navy-400">${selectedCourse.metadata?.price || 0}</span>
                  )}
                  {selectedCourse.metadata?.difficulty && (
                    <span className="text-xs text-navy-400">• {selectedCourse.metadata.difficulty.value}</span>
                  )}
                </div>
              </div>
              <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}