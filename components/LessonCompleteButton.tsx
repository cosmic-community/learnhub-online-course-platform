'use client'

import { useState } from 'react'
import LessonComplete from './LessonComplete'

interface LessonCompleteButtonProps {
  lessonTitle: string
  totalLessonsInCourse: number
  currentLessonIndex: number
}

export default function LessonCompleteButton({ 
  lessonTitle, 
  totalLessonsInCourse,
  currentLessonIndex 
}: LessonCompleteButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleComplete = () => {
    setShowModal(true)
    setIsCompleted(true)
  }

  return (
    <>
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40'
          }
        `}
      >
        {isCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Mark as Complete
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </button>

      {showModal && (
        <LessonComplete
          lessonTitle={lessonTitle}
          onClose={() => setShowModal(false)}
          totalLessonsInCourse={totalLessonsInCourse}
          completedLessons={currentLessonIndex + 1}
        />
      )}
    </>
  )
}