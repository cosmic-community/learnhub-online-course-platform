'use client'

import { useState, useEffect } from 'react'

interface LearningProgressBarProps {
  lessonSlug: string
  courseSlug: string
}

export default function LearningProgressBar({ lessonSlug, courseSlug }: LearningProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      const scrollProgress = Math.min((scrollTop / documentHeight) * 100, 100)
      
      setProgress(scrollProgress)
      
      // Mark as complete when user scrolls past 90%
      if (scrollProgress >= 90 && !isComplete) {
        setIsComplete(true)
        // Save completion to localStorage
        const completedKey = `lesson-complete-${courseSlug}-${lessonSlug}`
        localStorage.setItem(completedKey, 'true')
        
        // Update streak
        updateStreak()
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lessonSlug, courseSlug, isComplete])

  const updateStreak = () => {
    const today = new Date().toDateString()
    const lastActivity = localStorage.getItem('last-learning-date')
    const currentStreak = parseInt(localStorage.getItem('learning-streak') || '0')
    
    if (lastActivity !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActivity === yesterday.toDateString()) {
        // Continuing streak
        localStorage.setItem('learning-streak', String(currentStreak + 1))
      } else {
        // Reset streak
        localStorage.setItem('learning-streak', '1')
      }
      localStorage.setItem('last-learning-date', today)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-navy-800">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isComplete && (
        <div className="absolute right-4 top-3 flex items-center gap-2 text-sm text-primary-400 animate-pulse">
          <span>✓</span>
          <span>Lesson Complete!</span>
        </div>
      )}
    </div>
  )
}