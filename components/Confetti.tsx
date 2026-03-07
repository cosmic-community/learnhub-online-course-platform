'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
  rotation: number
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#06B6D4', // cyan
    ]

    const newPieces: ConfettiPiece[] = []
    const pieceCount = 100

    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
      })
    }

    setPieces(newPieces)

    // Clean up after animation
    const timeout = setTimeout(() => {
      setPieces([])
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
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
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}