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

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      const colors = ['#6366f1', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#f97316', '#ec4899']
      const newPieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
      }))
      setPieces(newPieces)

      const timeout = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timeout)
    }
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
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}