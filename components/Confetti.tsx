'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  scale: number
}

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
  duration?: number
}

const colors = [
  '#6366f1', // primary
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
]

export default function Confetti({ isActive, onComplete, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      })
    }
    setPieces(newPieces)
  }, [])

  useEffect(() => {
    if (isActive) {
      generatePieces()
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isActive, generatePieces, duration, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 confetti-piece"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
          }}
        />
      ))}
    </div>
  )
}

// Hook for triggering confetti
export function useConfetti() {
  const [isActive, setIsActive] = useState(false)

  const trigger = useCallback(() => {
    setIsActive(true)
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
  }, [])

  return { isActive, trigger, reset }
}