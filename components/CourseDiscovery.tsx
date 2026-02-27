'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseDiscoveryProps {
  courses: Course[]
}

export default function CourseDiscovery({ courses }: CourseDiscoveryProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const spinWheel = useCallback(() => {
    if (isSpinning || courses.length === 0) return
    
    setIsSpinning(true)
    setSelectedCourse(null)
    setShowConfetti(false)
    
    // Random spin amount
    const spins = 3 + Math.random() * 3
    const newRotation = rotation + spins * 360
    setRotation(newRotation)
    
    // Select random course after animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * courses.length)
      const course = courses[randomIndex]
      if (course) {
        setSelectedCourse(course)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2000)
      }
      setIsSpinning(false)
    }, 2000)
  }, [isSpinning, courses, rotation])

  return (
    <div className="relative">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                fontSize: '1.5rem',
              }}
            >
              {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          🎯 Discover Your Next Course
        </h3>
        <p className="text-navy-400 text-sm mb-6">
          Not sure what to learn? Let us surprise you!
        </p>

        {/* Spinning wheel button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="relative w-24 h-24 mx-auto mb-6 group"
        >
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center transition-transform duration-[2000ms] ease-out shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <span className="text-4xl">🎲</span>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-white/20 group-hover:border-white/40 transition-colors" />
        </button>

        <p className="text-navy-300 text-sm mb-4">
          {isSpinning ? '✨ Spinning...' : 'Click to discover!'}
        </p>

        {/* Selected course result */}
        {selectedCourse && !isSpinning && (
          <div className="animate-fadeIn mt-4 p-4 bg-navy-800/50 rounded-xl border border-primary-500/30">
            <div className="text-sm text-primary-400 mb-1">🎉 Your lucky pick:</div>
            <h4 className="text-lg font-semibold text-white mb-2">
              {selectedCourse.metadata?.title || selectedCourse.title}
            </h4>
            <p className="text-navy-300 text-sm mb-3 line-clamp-2">
              {selectedCourse.metadata?.tagline || 'Start your learning journey!'}
            </p>
            <Link
              href={`/courses/${selectedCourse.slug}`}
              className="btn-primary text-sm py-2 px-4"
            >
              View Course →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}