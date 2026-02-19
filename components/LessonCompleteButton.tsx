'use client'

import { useState, useEffect } from 'react'
import { completeLesson, isLessonCompleted, type Achievement } from '@/lib/progress'
import AchievementToast from './AchievementToast'
import confetti from 'canvas-confetti'

interface LessonCompleteButtonProps {
  courseSlug: string
  lessonSlug: string
  totalLessonsInCourse: number
  estimatedMinutes?: number
}

export default function LessonCompleteButton({
  courseSlug,
  lessonSlug,
  totalLessonsInCourse,
  estimatedMinutes = 10,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setIsCompleted(isLessonCompleted(courseSlug, lessonSlug))
  }, [courseSlug, lessonSlug])
  
  const handleComplete = () => {
    if (isCompleted || isAnimating) return
    
    setIsAnimating(true)
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
    })
    
    // Mark as complete
    const result = completeLesson(courseSlug, lessonSlug, totalLessonsInCourse, estimatedMinutes)
    
    setIsCompleted(true)
    setNewAchievements(result.newAchievements)
    
    setTimeout(() => setIsAnimating(false), 500)
  }
  
  const dismissAchievement = (index: number) => {
    setNewAchievements(prev => prev.filter((_, i) => i !== index))
  }
  
  if (!mounted) {
    return (
      <button className="btn-primary opacity-50 cursor-not-allowed">
        Loading...
      </button>
    )
  }
  
  return (
    <>
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`relative overflow-hidden transition-all duration-300 ${
          isCompleted
            ? 'bg-green-500/20 text-green-400 border border-green-500/50 px-6 py-3 rounded-lg font-semibold cursor-default'
            : 'btn-primary'
        } ${isAnimating ? 'scale-110' : ''}`}
      >
        {isCompleted ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>Mark as Complete</span>
            <span className="text-lg">✓</span>
          </span>
        )}
        
        {/* Ripple effect */}
        {isAnimating && (
          <span className="absolute inset-0 bg-white/30 animate-ping rounded-lg" />
        )}
      </button>
      
      {/* Achievement toasts */}
      {newAchievements.map((achievement, index) => (
        <AchievementToast
          key={achievement.id}
          achievement={achievement}
          onClose={() => dismissAchievement(index)}
        />
      ))}
    </>
  )
}