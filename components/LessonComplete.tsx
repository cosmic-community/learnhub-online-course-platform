'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface LessonCompleteProps {
  courseSlug: string
  lessonTitle: string
  nextLessonSlug?: string
  nextLessonTitle?: string
}

export default function LessonComplete({ 
  courseSlug, 
  lessonTitle, 
  nextLessonSlug, 
  nextLessonTitle 
}: LessonCompleteProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if lesson was already completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const lessonKey = `${courseSlug}-${lessonTitle}`
    if (completedLessons.includes(lessonKey)) {
      setIsComplete(true)
    }
  }, [courseSlug, lessonTitle])

  const handleComplete = () => {
    if (isComplete) return

    const lessonKey = `${courseSlug}-${lessonTitle}`
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    
    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey)
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons))
      
      // Update streak data
      const streakData = JSON.parse(localStorage.getItem('learning-streak') || '{}')
      if (streakData.totalLessonsViewed !== undefined) {
        streakData.totalLessonsViewed += 1
        localStorage.setItem('learning-streak', JSON.stringify(streakData))
      }
    }

    setIsComplete(true)
    setShowConfetti(true)
    setShowCelebration(true)

    // Hide celebration after delay
    setTimeout(() => setShowCelebration(false), 3000)
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 text-center max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Lesson Complete!</h3>
            <p className="text-navy-300 mb-6">
              Great job finishing &quot;{lessonTitle}&quot;! Keep up the momentum!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {nextLessonSlug && nextLessonTitle ? (
                <Link
                  href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                  className="btn-primary"
                >
                  Next: {nextLessonTitle}
                </Link>
              ) : (
                <Link href={`/courses/${courseSlug}`} className="btn-primary">
                  Back to Course
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Button */}
      <div className="mt-8 border-t border-navy-700 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <>
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-400 font-semibold">Lesson Completed!</span>
              </>
            ) : (
              <p className="text-navy-400">Finished this lesson?</p>
            )}
          </div>
          
          <button
            onClick={handleComplete}
            disabled={isComplete}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              isComplete
                ? 'bg-green-500/20 text-green-400 cursor-default'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
            }`}
          >
            {isComplete ? (
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
        </div>
      </div>
    </>
  )
}