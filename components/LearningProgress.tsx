'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LearningProgressProps {
  courseSlug: string
  lessonSlug: string
  totalLessons: number
  currentLessonIndex: number
}

export default function LearningProgress({
  courseSlug,
  lessonSlug,
  totalLessons,
  currentLessonIndex,
}: LearningProgressProps) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [streak, setStreak] = useState(0)

  const storageKey = `learnhub-progress-${courseSlug}`
  const streakKey = 'learnhub-learning-streak'
  const isCompleted = completedLessons.includes(lessonSlug)
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100)

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
    }

    // Load streak
    const streakData = localStorage.getItem(streakKey)
    if (streakData) {
      const { count, lastDate } = JSON.parse(streakData)
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastDate === today || lastDate === yesterday) {
        setStreak(count)
      } else {
        setStreak(0)
      }
    }
  }, [storageKey])

  const handleMarkComplete = () => {
    if (!isCompleted) {
      const newCompleted = [...completedLessons, lessonSlug]
      setCompletedLessons(newCompleted)
      localStorage.setItem(storageKey, JSON.stringify(newCompleted))
      
      // Update streak
      const today = new Date().toDateString()
      const streakData = localStorage.getItem(streakKey)
      let newStreak = 1
      
      if (streakData) {
        const { count, lastDate } = JSON.parse(streakData)
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastDate === yesterday) {
          newStreak = count + 1
        } else if (lastDate === today) {
          newStreak = count
        }
      }
      
      setStreak(newStreak)
      localStorage.setItem(streakKey, JSON.stringify({ count: newStreak, lastDate: today }))
      
      // Trigger celebration
      setShowConfetti(true)
      setJustCompleted(true)
      
      setTimeout(() => setJustCompleted(false), 2000)
    }
  }

  const handleUnmarkComplete = () => {
    const newCompleted = completedLessons.filter(l => l !== lessonSlug)
    setCompletedLessons(newCompleted)
    localStorage.setItem(storageKey, JSON.stringify(newCompleted))
  }

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Your Progress</h3>
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full animate-streak-glow">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-yellow-400">{streak} day streak!</span>
              </div>
            )}
          </div>
          <span className="text-2xl font-bold text-primary-400">{progressPercentage}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-3 bg-navy-800 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
          {justCompleted && (
            <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full animate-pulse" 
              style={{ width: `${progressPercentage}%` }} 
            />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-navy-400 text-sm">
            {completedLessons.length} of {totalLessons} lessons completed
          </p>
          
          {isCompleted ? (
            <button
              onClick={handleUnmarkComplete}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed!
            </button>
          ) : (
            <button
              onClick={handleMarkComplete}
              className={`flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all ${
                justCompleted ? 'animate-celebrate' : ''
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Complete
            </button>
          )}
        </div>
        
        {progressPercentage === 100 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/20 to-green-500/20 rounded-lg border border-primary-500/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="text-white font-semibold">Congratulations!</p>
                <p className="text-navy-300 text-sm">You&apos;ve completed this course!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}