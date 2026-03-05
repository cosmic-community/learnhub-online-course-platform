'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  size: number
  rotation: number
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const newPieces: ConfettiPiece[] = []

    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      })
    }

    setPieces(newPieces)

    // Clean up after animation
    const timer = setTimeout(() => setPieces([]), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  )
}