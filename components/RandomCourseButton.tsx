'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface RandomCourseButtonProps {
  courses: Course[]
}

export default function RandomCourseButton({ courses }: RandomCourseButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSurpriseMe = () => {
    if (courses.length === 0) return
    
    setIsSpinning(true)
    setShowResult(false)
    
    // Simulate "spinning" through courses
    let iterations = 0
    const maxIterations = 15
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setSelectedCourse(courses[randomIndex])
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        setIsSpinning(false)
        setShowResult(true)
      }
    }, 100)
  }

  return (
    <div className="relative">
      <button
        onClick={handleSurpriseMe}
        disabled={isSpinning}
        className="group relative overflow-hidden btn-secondary bg-gradient-to-r from-purple-500/10 to-primary-500/10 border-purple-500/30 hover:border-purple-500/50 hover:from-purple-500/20 hover:to-primary-500/20 disabled:opacity-70"
      >
        <span className={`flex items-center gap-2 ${isSpinning ? 'animate-pulse' : ''}`}>
          <span className={`text-xl ${isSpinning ? 'animate-spin' : 'group-hover:animate-bounce'}`}>
            🎲
          </span>
          <span>Surprise Me!</span>
        </span>
        
        {/* Sparkle effect on hover */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xs animate-sparkle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
      </button>

      {/* Result Modal */}
      {showResult && selectedCourse && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 animate-slideUp">
          <div className="card p-4 w-80 shadow-2xl border-primary-500/30">
            <div className="text-center mb-3">
              <span className="text-2xl">🎯</span>
              <p className="text-sm text-navy-400 mt-1">Your random pick:</p>
            </div>
            
            <Link 
              href={`/courses/${selectedCourse.slug}`}
              className="block group"
            >
              {selectedCourse.metadata?.thumbnail && (
                <img
                  src={`${selectedCourse.metadata.thumbnail.imgix_url}?w=320&h=180&fit=crop&auto=format,compress`}
                  alt={selectedCourse.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                {selectedCourse.metadata?.title || selectedCourse.title}
              </h4>
              {selectedCourse.metadata?.tagline && (
                <p className="text-sm text-navy-400 mt-1 line-clamp-1">
                  {selectedCourse.metadata.tagline}
                </p>
              )}
            </Link>

            <div className="flex gap-2 mt-4">
              <Link
                href={`/courses/${selectedCourse.slug}`}
                className="flex-1 btn-primary text-sm py-2"
              >
                Explore Course
              </Link>
              <button
                onClick={() => setShowResult(false)}
                className="px-3 py-2 text-navy-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}