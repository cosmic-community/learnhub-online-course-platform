'use client'

import { useState, useEffect } from 'react'
import Confetti from './Confetti'

interface LessonProgressProps {
  lessonId: string
  lessonTitle: string
  courseSlug: string
}

export default function LessonProgress({ lessonId, lessonTitle, courseSlug }: LessonProgressProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    // Check if lesson is already completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    setIsCompleted(completedLessons.includes(lessonId))
  }, [lessonId])

  const markAsComplete = () => {
    if (isCompleted) return

    // Save completion
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId)
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons))
      
      // Update total lessons completed count
      const totalCompleted = parseInt(localStorage.getItem('lessons-completed') || '0') + 1
      localStorage.setItem('lessons-completed', totalCompleted.toString())
    }

    setIsCompleted(true)
    setJustCompleted(true)
    setShowConfetti(true)

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000)
    setTimeout(() => setJustCompleted(false), 2000)
  }

  const markAsIncomplete = () => {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]')
    const updatedLessons = completedLessons.filter((id: string) => id !== lessonId)
    localStorage.setItem('completed-lessons', JSON.stringify(updatedLessons))
    
    // Update total lessons completed count
    const totalCompleted = Math.max(0, parseInt(localStorage.getItem('lessons-completed') || '0') - 1)
    localStorage.setItem('lessons-completed', totalCompleted.toString())
    
    setIsCompleted(false)
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className={`card p-6 transition-all duration-500 ${
        isCompleted 
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
          : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : 'bg-navy-800 text-navy-400'
              }
              ${justCompleted ? 'scale-125' : 'scale-100'}
            `}>
              {isCompleted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`font-semibold transition-colors ${
                isCompleted ? 'text-green-400' : 'text-white'
              }`}>
                {isCompleted ? 'Lesson Completed! 🎉' : 'Mark as Complete'}
              </h3>
              <p className="text-sm text-navy-400">
                {isCompleted 
                  ? 'Great job! You\'re making progress.' 
                  : 'Finished this lesson? Mark it complete to track your progress.'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <button
                onClick={markAsIncomplete}
                className="text-sm text-navy-400 hover:text-navy-200 transition-colors"
              >
                Undo
              </button>
            ) : (
              <button
                onClick={markAsComplete}
                className="btn-primary"
              >
                Complete Lesson
              </button>
            )}
          </div>
        </div>
        
        {justCompleted && (
          <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 text-sm font-medium">
              🌟 +1 lesson completed! Keep up the amazing work!
            </p>
          </div>
        )}
      </div>
    </>
  )
}