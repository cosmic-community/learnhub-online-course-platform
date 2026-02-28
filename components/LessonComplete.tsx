'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ConfettiCelebration from './ConfettiCelebration'

interface LessonCompleteProps {
  lessonTitle: string
  courseSlug: string
  nextLessonSlug?: string
  lessonNumber: number
  totalLessons: number
}

export default function LessonComplete({
  lessonTitle,
  courseSlug,
  nextLessonSlug,
  lessonNumber,
  totalLessons,
}: LessonCompleteProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    // Load completed lessons from localStorage
    const stored = localStorage.getItem('learnhub-completed-lessons')
    if (stored) {
      const completed = JSON.parse(stored) as string[]
      setCompletedLessons(completed)
      const lessonKey = `${courseSlug}-${lessonNumber}`
      setIsCompleted(completed.includes(lessonKey))
    }
  }, [courseSlug, lessonNumber])

  const handleMarkComplete = () => {
    const lessonKey = `${courseSlug}-${lessonNumber}`
    if (!completedLessons.includes(lessonKey)) {
      const newCompleted = [...completedLessons, lessonKey]
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(newCompleted))
      setCompletedLessons(newCompleted)
      setIsCompleted(true)
      setShowConfetti(true)
      
      // Update streak
      const streakData = localStorage.getItem('learnhub-streak')
      if (streakData) {
        const data = JSON.parse(streakData)
        data.lastVisit = new Date().toDateString()
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    }
  }

  const progress = Math.round((lessonNumber / totalLessons) * 100)
  const isCourseComplete = progress === 100 && isCompleted

  return (
    <>
      <ConfettiCelebration trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="mt-12 p-6 bg-navy-800/50 rounded-2xl border border-navy-700">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-navy-400">Course Progress</span>
            <span className="text-sm font-medium text-primary-400">{progress}%</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-2">
            Lesson {lessonNumber} of {totalLessons}
          </p>
        </div>

        {isCourseComplete ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Course Complete!</h3>
            <p className="text-navy-300 mb-4">
              Congratulations! You&apos;ve completed all lessons in this course.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
              <span>🏆</span>
              <span className="text-yellow-400 font-medium">Achievement Unlocked: Course Master</span>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-400 font-medium">Lesson Completed!</p>
                <p className="text-navy-400 text-sm">{lessonTitle}</p>
              </div>
            </div>
            
            {nextLessonSlug && (
              <Link 
                href={`/courses/${courseSlug}/lessons/${nextLessonSlug}`}
                className="btn-primary flex items-center gap-2"
              >
                Next Lesson
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">Ready to move on?</p>
              <p className="text-navy-400 text-sm">Mark this lesson as complete to track your progress</p>
            </div>
            
            <button 
              onClick={handleMarkComplete}
              className="btn-primary flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Complete
            </button>
          </div>
        )}
      </div>
    </>
  )
}