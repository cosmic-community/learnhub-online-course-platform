'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      // Generate confetti pieces
      const colors = ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb7185']
      const newPieces: ConfettiPiece[] = []
      
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
        })
      }
      
      setPieces(newPieces)

      // Clean up after animation
      setTimeout(() => {
        setIsActive(false)
        setPieces([])
        onComplete?.()
      }, 4000)
    }
  }, [trigger, isActive, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Central celebration text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-celebration-pop text-center">
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-3xl font-bold text-white bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Lesson Complete!
          </div>
          <div className="text-navy-300 mt-2">Keep up the great work!</div>
        </div>
      </div>

      {/* Confetti pieces */}
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  )
}