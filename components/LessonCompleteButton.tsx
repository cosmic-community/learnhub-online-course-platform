'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LessonCompleteButtonProps {
  lessonSlug: string
  courseSlug: string
  onComplete?: () => void
}

export default function LessonCompleteButton({ lessonSlug, courseSlug, onComplete }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`
    setIsCompleted(completedLessons.includes(lessonKey))
  }, [lessonSlug, courseSlug])

  const handleComplete = () => {
    if (isCompleted) return

    const lessonKey = `${courseSlug}/${lessonSlug}`
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    
    if (!completedLessons.includes(lessonKey)) {
      completedLessons.push(lessonKey)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
      
      // Update streak data
      const streakData = JSON.parse(localStorage.getItem('learnhub-streak') || '{}')
      if (streakData.totalLessonsViewed !== undefined) {
        streakData.totalLessonsViewed = (streakData.totalLessonsViewed || 0) + 1
        streakData.lessonsThisWeek = (streakData.lessonsThisWeek || 0) + 1
        localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
      }
      
      setIsCompleted(true)
      setShowConfetti(true)
      setJustCompleted(true)
      
      // Check for milestone achievements
      const totalCompleted = completedLessons.length
      if (totalCompleted === 1 || totalCompleted === 5 || totalCompleted === 10 || totalCompleted % 25 === 0) {
        // Extended celebration for milestones
        setTimeout(() => setShowConfetti(false), 4000)
      } else {
        setTimeout(() => setShowConfetti(false), 2000)
      }
      
      onComplete?.()
    }
  }

  return (
    <>
      <Confetti isActive={showConfetti} duration={3000} />
      
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 
          flex items-center justify-center gap-3
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-default' 
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02]'
          }
        `}
      >
        {isCompleted ? (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {justCompleted ? 'Lesson Completed! 🎉' : 'Completed'}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </>
        )}
      </button>
    </>
  )
}