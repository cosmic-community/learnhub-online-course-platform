'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface LessonCompleteButtonProps {
  lessonSlug: string
  lessonTitle: string
  courseSlug: string
  courseTitle: string
  durationMinutes: number
  nextLessonSlug?: string
  nextLessonTitle?: string
}

export default function LessonCompleteButton({
  lessonSlug,
  lessonTitle,
  courseSlug,
  courseTitle,
  durationMinutes,
  nextLessonSlug,
  nextLessonTitle
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if lesson was already completed
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]') as string[]
    setIsCompleted(completedLessons.includes(lessonSlug))
  }, [lessonSlug])

  const handleComplete = () => {
    if (isCompleted) return

    // Mark lesson as completed
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]') as string[]
    if (!completedLessons.includes(lessonSlug)) {
      completedLessons.push(lessonSlug)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
    }

    // Update progress stats
    const stats = JSON.parse(localStorage.getItem('learnhub-progress') || '{}')
    const updatedStats = {
      ...stats,
      lessonsCompleted: (stats.lessonsCompleted || 0) + 1,
      totalMinutesLearned: (stats.totalMinutesLearned || 0) + durationMinutes,
      lastLessonSlug: nextLessonSlug || lessonSlug,
      lastLessonTitle: nextLessonTitle || lessonTitle,
      lastCourseSlug: courseSlug,
      lastCourseTitle: courseTitle
    }
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedStats))

    setIsCompleted(true)
    setShowCelebration(true)

    // Trigger confetti! 🎉
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#a855f7', '#22d3ee', '#06b6d4']
    })

    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 3000)
  }

  return (
    <div className="relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-navy-900/90 backdrop-blur-sm rounded-2xl p-8 text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Lesson Complete!</h3>
            <p className="text-navy-300">You earned +{durationMinutes} minutes of learning time!</p>
          </div>
        </div>
      )}

      {/* Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 cursor-default'
              : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105'
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

        {nextLessonSlug && (
          <a
            href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Next Lesson
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}