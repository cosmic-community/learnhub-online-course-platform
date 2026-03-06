'use client'

import { useState, useEffect } from 'react'
import LessonCompleteModal from './LessonCompleteModal'

interface MarkCompleteButtonProps {
  lessonTitle: string
  lessonSlug: string
  courseSlug: string
  nextLessonSlug?: string
  completedCount: number
  totalLessons: number
}

export default function MarkCompleteButton({
  lessonTitle,
  lessonSlug,
  courseSlug,
  nextLessonSlug,
  completedCount,
  totalLessons,
}: MarkCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentCompletedCount, setCurrentCompletedCount] = useState(completedCount)

  useEffect(() => {
    // Check if this lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    setIsCompleted(completedLessons.includes(lessonTitle))
    
    // Count how many lessons in this course are completed
    // For simplicity, we're using a basic count here
    setCurrentCompletedCount(completedCount)
  }, [lessonTitle, completedCount])

  const handleComplete = () => {
    if (!isCompleted) {
      setIsCompleted(true)
      setCurrentCompletedCount(prev => prev + 1)
      setShowModal(true)
    }
  }

  return (
    <>
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>

      <LessonCompleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        lessonTitle={lessonTitle}
        courseSlug={courseSlug}
        nextLessonSlug={nextLessonSlug}
        completedCount={currentCompletedCount}
        totalLessons={totalLessons}
      />
    </>
  )
}