'use client'

import { useState, useEffect } from 'react'
import ConfettiCelebration from './ConfettiCelebration'

interface LessonCompletionButtonProps {
  lessonSlug: string
  lessonTitle: string
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalDaysLearned: number
  lessonsCompleted: number
}

export default function LessonCompletionButton({ lessonSlug, lessonTitle }: LessonCompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    setIsCompleted(completedLessons.includes(lessonSlug))
  }, [lessonSlug])

  const handleComplete = () => {
    if (isCompleted) return

    // Mark lesson as completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    if (!completedLessons.includes(lessonSlug)) {
      completedLessons.push(lessonSlug)
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons))
    }

    // Update streak
    const today = new Date().toDateString()
    const stored = localStorage.getItem('learnhub-streak')
    const current: StreakData = stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      totalDaysLearned: 0,
      lessonsCompleted: 0,
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let newStreak = current.currentStreak

    if (current.lastActiveDate !== today) {
      if (current.lastActiveDate === yesterday || !current.lastActiveDate) {
        newStreak = current.currentStreak + 1
      } else {
        newStreak = 1
      }
    }

    const newData: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
      lastActiveDate: today,
      totalDaysLearned: current.lastActiveDate !== today ? current.totalDaysLearned + 1 : current.totalDaysLearned,
      lessonsCompleted: current.lessonsCompleted + 1,
    }

    localStorage.setItem('learnhub-streak', JSON.stringify(newData))

    // Trigger celebrations
    setIsCompleted(true)
    setShowConfetti(true)
    setShowSuccess(true)

    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <ConfettiCelebration 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Success message */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-celebrate">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="font-medium">Lesson completed!</span>
          </div>
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02]'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Lesson Completed!
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            Mark as Complete
          </>
        )}
      </button>

      {!isCompleted && (
        <p className="text-center text-sm text-navy-400 mt-2">
          Complete this lesson to build your streak! 🔥
        </p>
      )}
    </>
  )
}