'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#FF8B94', // Pink
  '#A8E6CF', // Light green
  '#DDA0DD', // Plum
  '#87CEEB', // Sky blue
  '#F9A825', // Orange
  '#7C4DFF', // Purple
]

export default function Confetti({ isActive, duration = 3000, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!isActive) {
      setPieces([])
      return
    }

    // Create confetti pieces
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 150; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 4,
      })
    }
    setPieces(newPieces)

    // Cleanup after duration
    const timer = setTimeout(() => {
      setPieces([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isActive, duration, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}