'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  lessonId: string
  lessonSlug: string
  courseSlug: string
  onComplete?: () => void
}

export default function LessonCompleteButton({ 
  lessonId, 
  lessonSlug, 
  courseSlug,
  onComplete 
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if lesson is already completed
    const completedLessons = localStorage.getItem('completed-lessons')
    if (completedLessons) {
      const lessons = JSON.parse(completedLessons) as string[]
      setIsCompleted(lessons.includes(lessonId))
    }
  }, [lessonId])

  const handleComplete = () => {
    if (isCompleted) return

    // Save to localStorage
    const completedLessons = localStorage.getItem('completed-lessons')
    const lessons = completedLessons ? JSON.parse(completedLessons) as string[] : []
    
    if (!lessons.includes(lessonId)) {
      lessons.push(lessonId)
      localStorage.setItem('completed-lessons', JSON.stringify(lessons))
    }

    // Also track enrolled courses
    const enrolledCourses = localStorage.getItem('enrolled-courses')
    const courses = enrolledCourses ? JSON.parse(enrolledCourses) as string[] : []
    if (!courses.includes(courseSlug)) {
      courses.push(courseSlug)
      localStorage.setItem('enrolled-courses', JSON.stringify(courses))
    }

    setIsCompleted(true)
    setShowConfetti(true)
    onComplete?.()
  }

  const handleUnmark = () => {
    const completedLessons = localStorage.getItem('completed-lessons')
    if (completedLessons) {
      const lessons = JSON.parse(completedLessons) as string[]
      const filtered = lessons.filter(id => id !== lessonId)
      localStorage.setItem('completed-lessons', JSON.stringify(filtered))
    }
    setIsCompleted(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {isCompleted ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-green-400 font-medium">Completed!</span>
          </div>
          <button
            onClick={handleUnmark}
            className="text-sm text-navy-500 hover:text-navy-300 transition-colors"
          >
            Unmark
          </button>
        </div>
      ) : (
        <button
          onClick={handleComplete}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mark as Complete
          <span className="text-lg group-hover:animate-bounce">🎉</span>
        </button>
      )}
    </>
  )
}