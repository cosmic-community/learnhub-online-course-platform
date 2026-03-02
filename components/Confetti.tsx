'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  left: string
  delay: string
  color: string
  size: number
}

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

const COLORS = [
  '#6366f1', // primary
  '#22c55e', // green
  '#eab308', // yellow
  '#ec4899', // pink
  '#3b82f6', // blue
  '#f97316', // orange
  '#8b5cf6', // purple
]

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 6,
      }))
      setPieces(newPieces)

      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 3500)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isActive && pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}