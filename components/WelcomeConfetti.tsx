'use client'

import { useState, useEffect } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

export default function WelcomeConfetti() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    // Only show confetti for new visitors or after a streak milestone
    const hasSeenConfetti = sessionStorage.getItem('learnhub-confetti-shown')
    const streak = parseInt(localStorage.getItem('learnhub-streak') || '0')
    const lastStreak = parseInt(sessionStorage.getItem('learnhub-last-streak') || '0')
    
    // Show confetti for first visit in session or streak milestones
    const isMilestone = [7, 14, 30, 50, 100].includes(streak) && streak > lastStreak
    
    if (!hasSeenConfetti || isMilestone) {
      setShouldShow(true)
      sessionStorage.setItem('learnhub-confetti-shown', 'true')
      sessionStorage.setItem('learnhub-last-streak', streak.toString())
      
      // Generate confetti pieces
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      }))
      
      setConfetti(pieces)
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setShouldShow(false)
        setConfetti([])
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  if (!shouldShow || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}