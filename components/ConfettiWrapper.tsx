'use client'

import { useState, useEffect } from 'react'

export default function ConfettiWrapper() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const handleLessonComplete = () => {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    }

    window.addEventListener('lesson-completed', handleLessonComplete)
    return () => window.removeEventListener('lesson-completed', handleLessonComplete)
  }, [])

  if (!showConfetti) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Confetti particles */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${2.5 + Math.random() * 2}s`,
          }}
        >
          <span
            className="block"
            style={{
              width: `${6 + Math.random() * 8}px`,
              height: `${6 + Math.random() * 8}px`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#58D68D', '#5DADE2'][Math.floor(Math.random() * 9)],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}

      {/* Celebration message */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-in">
        <div className="bg-navy-900/95 backdrop-blur-sm border border-primary-500/50 rounded-2xl px-8 py-6 text-center shadow-2xl shadow-primary-500/20">
          <div className="text-5xl mb-2">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-1">Great job!</h3>
          <p className="text-navy-300">Lesson completed successfully</p>
        </div>
      </div>
    </div>
  )
}