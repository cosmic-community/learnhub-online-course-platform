'use client'

import { useState, useEffect } from 'react'

interface LessonCompleteBadgeProps {
  lessonSlug: string
  courseSlug: string
}

export default function LessonCompleteBadge({ lessonSlug, courseSlug }: LessonCompleteBadgeProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`
    setIsCompleted(completedLessons.includes(lessonKey))
  }, [lessonSlug, courseSlug])

  const toggleCompletion = () => {
    const completedLessons = JSON.parse(localStorage.getItem('learnhub-completed-lessons') || '[]')
    const lessonKey = `${courseSlug}/${lessonSlug}`
    
    if (isCompleted) {
      // Remove from completed
      const updated = completedLessons.filter((l: string) => l !== lessonKey)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(updated))
      setIsCompleted(false)
    } else {
      // Add to completed
      completedLessons.push(lessonKey)
      localStorage.setItem('learnhub-completed-lessons', JSON.stringify(completedLessons))
      setIsCompleted(true)
      setShowAnimation(true)
      
      // Update lessons viewed in streak data
      const streakData = JSON.parse(localStorage.getItem('learnhub-streak') || '{}')
      streakData.lessonsViewed = (streakData.lessonsViewed || 0) + 1
      localStorage.setItem('learnhub-streak', JSON.stringify(streakData))
      
      setTimeout(() => setShowAnimation(false), 1000)
    }
  }

  return (
    <button
      onClick={toggleCompletion}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
          : 'bg-navy-800 text-navy-300 border border-navy-700 hover:border-primary-500/50 hover:text-primary-400'
      } ${showAnimation ? 'scale-110' : 'scale-100'}`}
    >
      <span className={`text-xl transition-transform duration-300 ${showAnimation ? 'animate-bounce' : ''}`}>
        {isCompleted ? '✅' : '⭕'}
      </span>
      <span>
        {isCompleted ? 'Completed!' : 'Mark as Complete'}
      </span>
    </button>
  )
}