'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
}

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

const colors = [
  '#14b8a6', // primary
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#22c55e', // green
]

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
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

      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isActive && pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          <div
            className="w-3 h-3 rotate-45"
            style={{ backgroundColor: piece.color }}
          />
        </div>
      ))}
    </div>
  )
}