'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speed: number
  wobble: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ef4444', // red
]

export default function Confetti({ isActive, duration = 3000, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (isActive) {
      // Create confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        speed: 2 + Math.random() * 3,
        wobble: Math.random() * 10 - 5,
      }))
      setPieces(newPieces)

      // Clear after duration
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isActive, duration, onComplete])

  if (!isActive && pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            animation: `confetti-fall ${piece.speed}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          <div
            style={{
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              animation: `confetti-wobble ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            top: -10%;
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        @keyframes confetti-wobble {
          0%, 100% {
            transform: rotate(0deg) translateX(0);
          }
          25% {
            transform: rotate(15deg) translateX(5px);
          }
          75% {
            transform: rotate(-15deg) translateX(-5px);
          }
        }
      `}</style>
    </div>
  )
}