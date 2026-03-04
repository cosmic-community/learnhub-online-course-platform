'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
}

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!isActive) {
      setPieces([])
      return
    }

    // Generate confetti pieces
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }))

    setPieces(newPieces)

    // Clean up after animation
    const timer = setTimeout(() => {
      setPieces([])
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timer)
  }, [isActive, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
      
      {/* Celebration message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-navy-900/90 backdrop-blur-sm text-white px-8 py-6 rounded-2xl shadow-2xl animate-bounce-in text-center">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-2xl font-bold mb-1">Lesson Complete!</div>
          <div className="text-navy-300">Keep up the great work!</div>
        </div>
      </div>
    </div>
  )
}