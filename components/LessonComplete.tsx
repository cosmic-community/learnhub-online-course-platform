'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LessonCompleteProps {
  lessonTitle: string
  onClose: () => void
  totalLessonsInCourse: number
  completedLessons: number
}

export default function LessonComplete({ 
  lessonTitle, 
  onClose, 
  totalLessonsInCourse,
  completedLessons 
}: LessonCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [streakUpdated, setStreakUpdated] = useState(false)

  useEffect(() => {
    // Update streak in localStorage
    const savedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data = savedData ? JSON.parse(savedData) : {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      totalLessonsCompleted: 0
    }

    const lastActive = data.lastActiveDate ? new Date(data.lastActiveDate).toDateString() : ''
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    // Update streak logic
    if (lastActive !== today) {
      if (lastActive === yesterday) {
        data.currentStreak += 1
      } else if (!lastActive) {
        data.currentStreak = 1
      } else {
        data.currentStreak = 1 // Reset if more than a day gap
      }
      
      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak
      }
      
      data.lastActiveDate = new Date().toISOString()
    }
    
    data.totalLessonsCompleted += 1
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakUpdated(true)
  }, [])

  const progress = Math.round((completedLessons / totalLessonsInCourse) * 100)

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center animate-bounce-in">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 Lesson Complete!
          </h2>
          <p className="text-navy-300 mb-6">
            You've finished <span className="text-primary-400 font-medium">"{lessonTitle}"</span>
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-navy-400">Course Progress</span>
              <span className="text-primary-400 font-medium">{progress}%</span>
            </div>
            <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-navy-500 mt-2">
              {completedLessons} of {totalLessonsInCourse} lessons completed
            </p>
          </div>

          {/* Streak Update */}
          {streakUpdated && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-orange-400 font-medium">Streak updated!</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </>
  )
}