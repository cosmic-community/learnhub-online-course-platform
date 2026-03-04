'use client'

import { useState, useEffect } from 'react'

interface LessonProgressProps {
  lessonSlug: string
  courseSlug: string
}

export default function LessonProgress({ lessonSlug, courseSlug }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const stored = localStorage.getItem('viewed-lessons')
    if (stored) {
      try {
        const viewed = JSON.parse(stored)
        if (Array.isArray(viewed) && viewed.includes(`${courseSlug}/${lessonSlug}`)) {
          setIsCompleted(true)
        }
      } catch {
        // Invalid data, ignore
      }
    }
  }, [lessonSlug, courseSlug])

  const markAsCompleted = () => {
    const lessonKey = `${courseSlug}/${lessonSlug}`
    const stored = localStorage.getItem('viewed-lessons')
    let viewed: string[] = []
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          viewed = parsed
        }
      } catch {
        // Invalid data, start fresh
      }
    }

    if (!viewed.includes(lessonKey)) {
      viewed.push(lessonKey)
      localStorage.setItem('viewed-lessons', JSON.stringify(viewed))
      setIsCompleted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const markAsIncomplete = () => {
    const lessonKey = `${courseSlug}/${lessonSlug}`
    const stored = localStorage.getItem('viewed-lessons')
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((key: string) => key !== lessonKey)
          localStorage.setItem('viewed-lessons', JSON.stringify(updated))
          setIsCompleted(false)
        }
      } catch {
        // Invalid data, ignore
      }
    }
  }

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
          🎉
        </div>
      )}
      
      {isCompleted ? (
        <button
          onClick={markAsIncomplete}
          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Completed!</span>
        </button>
      ) : (
        <button
          onClick={markAsCompleted}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-navy-200 border border-navy-700 rounded-lg hover:bg-navy-700 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Mark as Complete</span>
        </button>
      )}
    </div>
  )
}