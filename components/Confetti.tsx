'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

const colors = [
  '#00d4ff', // primary-400
  '#0ea5e9', // primary-500
  '#38bdf8', // primary-300
  '#fbbf24', // yellow
  '#a855f7', // purple
  '#22c55e', // green
  '#f43f5e', // rose
  '#f97316', // orange
]

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      })
    }
    setPieces(newPieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
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
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}