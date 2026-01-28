'use client'

import { useState, useEffect } from 'react'

interface LessonProgressProps {
  courseSlug: string
  lessonSlug: string
  lessonTitle: string
}

export default function LessonProgress({ courseSlug, lessonSlug, lessonTitle }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  useEffect(() => {
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    if (stored) {
      const completed = JSON.parse(stored) as string[]
      setIsCompleted(completed.includes(lessonSlug))
    }
  }, [courseSlug, lessonSlug])
  
  const toggleComplete = () => {
    const stored = localStorage.getItem(`course-progress-${courseSlug}`)
    const completed = stored ? (JSON.parse(stored) as string[]) : []
    
    let updated: string[]
    if (completed.includes(lessonSlug)) {
      updated = completed.filter(s => s !== lessonSlug)
      setIsCompleted(false)
    } else {
      updated = [...completed, lessonSlug]
      setIsCompleted(true)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
    
    localStorage.setItem(`course-progress-${courseSlug}`, JSON.stringify(updated))
  }
  
  return (
    <>
      {/* Floating Mark Complete Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleComplete}
          className={`group flex items-center gap-3 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
            isCompleted
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25'
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/25 hover:shadow-primary-500/40'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            isCompleted ? 'bg-white/20' : 'bg-white/20'
          }`}>
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </span>
          <span className="hidden sm:inline">
            {isCompleted ? 'Completed!' : 'Mark Complete'}
          </span>
        </button>
      </div>
      
      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-24 right-6 z-50 animate-slideUp">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-500/25 flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <div className="font-semibold">Lesson Complete!</div>
              <div className="text-sm text-green-100">Keep up the great work</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}