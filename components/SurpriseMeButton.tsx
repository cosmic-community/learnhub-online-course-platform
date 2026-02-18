'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Course } from '@/types'

interface SurpriseMeButtonProps {
  courses: Course[]
}

export default function SurpriseMeButton({ courses }: SurpriseMeButtonProps) {
  const router = useRouter()
  const [isSpinning, setIsSpinning] = useState(false)

  const handleSurpriseMe = () => {
    if (courses.length === 0 || isSpinning) return

    setIsSpinning(true)

    // Add a fun spinning delay before redirecting
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * courses.length)
      const randomCourse = courses[randomIndex]
      if (randomCourse) {
        router.push(`/courses/${randomCourse.slug}`)
      }
    }, 800)
  }

  return (
    <button
      onClick={handleSurpriseMe}
      disabled={isSpinning || courses.length === 0}
      className="btn-secondary text-lg group relative overflow-hidden"
    >
      <span className={`flex items-center gap-2 transition-transform ${isSpinning ? 'scale-0' : 'scale-100'}`}>
        <span className={`transition-transform ${isSpinning ? 'animate-spin' : 'group-hover:rotate-12'}`}>
          🎲
        </span>
        Surprise Me!
      </span>
      {isSpinning && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin text-2xl">🎯</span>
        </span>
      )}
    </button>
  )
}