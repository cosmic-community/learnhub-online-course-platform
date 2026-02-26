'use client'

import { useState, useEffect } from 'react'
import { updateLearningStreak } from './LearningStreak'
import { saveLastViewedLesson } from './QuickResume'

interface LessonCompleteButtonProps {
  courseSlug: string
  courseTitle: string
  lessonSlug: string
  lessonTitle: string
  courseThumbnail?: string
  durationMinutes?: number
  nextLessonSlug?: string
  nextLessonTitle?: string
}

export default function LessonCompleteButton({
  courseSlug,
  courseTitle,
  lessonSlug,
  lessonTitle,
  courseThumbnail,
  durationMinutes = 0,
  nextLessonSlug,
  nextLessonTitle,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streakUpdated, setStreakUpdated] = useState(false)

  useEffect(() => {
    // Check if lesson was already completed
    const completed = localStorage.getItem(`lesson-completed-${courseSlug}-${lessonSlug}`)
    if (completed) {
      setIsCompleted(true)
    }

    // Save current position for quick resume
    saveLastViewedLesson({
      courseSlug,
      courseTitle,
      lessonSlug,
      lessonTitle,
      courseThumbnail,
      progress: completed ? 100 : 50, // Assume 50% if just viewing
    })
  }, [courseSlug, courseTitle, lessonSlug, lessonTitle, courseThumbnail])

  const handleComplete = () => {
    if (isCompleted) return

    // Mark as completed
    localStorage.setItem(`lesson-completed-${courseSlug}-${lessonSlug}`, 'true')
    setIsCompleted(true)

    // Update streak
    const updatedStreak = updateLearningStreak(durationMinutes)
    
    // Show celebration
    setShowConfetti(true)
    setStreakUpdated(true)
    
    // Update quick resume with 100% progress
    saveLastViewedLesson({
      courseSlug,
      courseTitle,
      lessonSlug: nextLessonSlug || lessonSlug,
      lessonTitle: nextLessonTitle || lessonTitle,
      courseThumbnail,
      progress: nextLessonSlug ? 0 : 100,
    })

    setTimeout(() => {
      setShowConfetti(false)
      setStreakUpdated(false)
    }, 3000)
  }

  return (
    <div className="relative">
      {showConfetti && <ConfettiCelebration />}
      
      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-navy-900/50 rounded-xl border border-navy-800">
        <div className="flex-1 text-center sm:text-left">
          {isCompleted ? (
            <>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-green-400 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Lesson Completed!</span>
              </div>
              <p className="text-navy-400 text-sm">Great job! Keep up the momentum.</p>
            </>
          ) : (
            <>
              <h4 className="text-white font-semibold mb-1">Finished this lesson?</h4>
              <p className="text-navy-400 text-sm">Mark it complete to track your progress and build your streak!</p>
            </>
          )}
        </div>
        
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 cursor-default'
              : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105'
          }`}
        >
          {isCompleted ? (
            <>
              <span>✓</span>
              Completed
            </>
          ) : (
            <>
              <span>🎯</span>
              Mark Complete
            </>
          )}
        </button>
      </div>

      {streakUpdated && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
          🔥 Streak Updated!
        </div>
      )}
    </div>
  )
}

function ConfettiCelebration() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-3 h-3"
            style={{
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        </div>
      ))}
    </div>
  )
}