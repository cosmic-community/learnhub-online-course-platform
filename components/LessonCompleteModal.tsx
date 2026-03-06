'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface LessonCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  lessonTitle: string
  courseSlug: string
  nextLessonSlug?: string
  completedCount: number
  totalLessons: number
}

const celebrationMessages = [
  "You're crushing it! 🎉",
  "Knowledge acquired! 🧠",
  "Level up! ⬆️",
  "Brilliant work! ✨",
  "You're on fire! 🔥",
  "Unstoppable! 💪",
]

export default function LessonCompleteModal({
  isOpen,
  onClose,
  lessonTitle,
  courseSlug,
  nextLessonSlug,
  completedCount,
  totalLessons,
}: LessonCompleteModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [message] = useState(() => 
    celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]
  )

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Update lesson completion in localStorage
      const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
      if (!completedLessons.includes(lessonTitle)) {
        completedLessons.push(lessonTitle)
        localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
      }
    }
  }, [isOpen, lessonTitle])

  if (!isOpen) return null

  const progressPercent = Math.round((completedCount / totalLessons) * 100)
  const isCourseDone = completedCount === totalLessons

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-gradient-to-b from-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-modalSlideIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-navy-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {isCourseDone ? '🎓' : '🎯'}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {isCourseDone ? 'Course Complete!' : 'Lesson Complete!'}
            </h2>
            
            <p className="text-primary-400 font-semibold text-lg mb-4">
              {message}
            </p>
            
            <p className="text-navy-300 mb-6 text-sm">
              You finished: <span className="text-white">{lessonTitle}</span>
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-400">Course Progress</span>
                <span className="text-primary-400 font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-navy-400 mt-2">
                {completedCount} of {totalLessons} lessons completed
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {nextLessonSlug && !isCourseDone ? (
                <Link
                  href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  Next Lesson
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : isCourseDone ? (
                <Link
                  href="/courses"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  Browse More Courses
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </Link>
              ) : null}
              
              <Link
                href={`/courses/${courseSlug}`}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                onClick={onClose}
              >
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}