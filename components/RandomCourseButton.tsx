'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Course {
  slug: string
  title: string
}

interface RandomCourseButtonProps {
  courses: Course[]
}

export default function RandomCourseButton({ courses }: RandomCourseButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const router = useRouter()

  const handleRandomCourse = () => {
    if (courses.length === 0) return
    
    setIsSpinning(true)
    
    // Create suspense with a slot-machine effect
    let iterations = 0
    const maxIterations = 15
    const interval = setInterval(() => {
      iterations++
      if (iterations >= maxIterations) {
        clearInterval(interval)
        setIsSpinning(false)
        const randomIndex = Math.floor(Math.random() * courses.length)
        const selectedCourse = courses[randomIndex]
        if (selectedCourse) {
          router.push(`/courses/${selectedCourse.slug}`)
        }
      }
    }, 100)
  }

  return (
    <button
      onClick={handleRandomCourse}
      disabled={isSpinning}
      className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/40 overflow-hidden disabled:opacity-70"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <span className={`text-xl ${isSpinning ? 'animate-spin' : 'group-hover:animate-bounce'}`}>
        🎲
      </span>
      <span className="relative">
        {isSpinning ? 'Finding...' : 'Surprise Me!'}
      </span>
    </button>
  )
}