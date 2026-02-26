'use client'

import { useState, useEffect } from 'react'

interface LessonCompleteButtonProps {
  lessonSlug: string
  durationMinutes: number
}

export default function LessonCompleteButton({ lessonSlug, durationMinutes }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const savedStats = localStorage.getItem('learning-progress')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setIsCompleted(stats.lessonsCompleted?.includes(lessonSlug) ?? false)
    }
  }, [lessonSlug])

  const handleComplete = () => {
    if (isCompleted) return
    
    const savedStats = localStorage.getItem('learning-progress')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      if (!stats.lessonsCompleted) {
        stats.lessonsCompleted = []
      }
      if (!stats.lessonsCompleted.includes(lessonSlug)) {
        stats.lessonsCompleted.push(lessonSlug)
        stats.totalMinutesLearned = (stats.totalMinutesLearned || 0) + durationMinutes
        localStorage.setItem('learning-progress', JSON.stringify(stats))
      }
    }
    
    setIsCompleted(true)
    setShowCelebration(true)
    triggerConfetti()
    
    setTimeout(() => setShowCelebration(false), 3000)
  }

  return (
    <div className="relative">
      <button
        onClick={handleComplete}
        disabled={isCompleted}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform
          ${isCompleted 
            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-default' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/25'
          }
        `}
      >
        {isCompleted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Lesson Completed!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mark as Complete
          </span>
        )}
      </button>
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-navy-900/90 backdrop-blur-sm rounded-3xl p-8 animate-bounce-in shadow-2xl border border-primary-500/30">
            <div className="text-center">
              <span className="text-6xl block mb-4">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">Awesome!</h3>
              <p className="text-navy-300">You completed this lesson!</p>
              <p className="text-primary-400 text-sm mt-2">+{durationMinutes} minutes added to your progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Confetti celebration function
function triggerConfetti(): void {
  const colors = ['#29ABE2', '#4ADE80', '#FBBF24', '#F472B6', '#A78BFA']
  const confettiCount = 100
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div')
    confetti.style.cssText = `
      position: fixed;
      width: ${5 + Math.random() * 10}px;
      height: ${5 + Math.random() * 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${2 + Math.random() * 3}s ease-out forwards;
      transform: rotate(${Math.random() * 360}deg);
    `
    document.body.appendChild(confetti)
    
    setTimeout(() => confetti.remove(), 5000)
  }
}