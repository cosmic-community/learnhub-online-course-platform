'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  velocityX: number
  velocityY: number
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = [
  '#14b8a6', // primary-500
  '#2dd4bf', // primary-400
  '#5eead4', // primary-300
  '#fbbf24', // yellow
  '#f472b6', // pink
  '#a78bfa', // purple
  '#60a5fa', // blue
]

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)
  
  const createConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    
    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.5 + Math.random() * 0.5,
        velocityX: (Math.random() - 0.5) * 3,
        velocityY: 2 + Math.random() * 3,
      })
    }
    
    setPieces(newPieces)
    setIsActive(true)
    
    // Clean up after animation
    setTimeout(() => {
      setIsActive(false)
      setPieces([])
      onComplete?.()
    }, 4000)
  }, [onComplete])
  
  useEffect(() => {
    if (trigger && !isActive) {
      createConfetti()
    }
  }, [trigger, isActive, createConfetti])
  
  if (!isActive || pieces.length === 0) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2.5 + Math.random() * 1.5}s`,
          }}
        />
      ))}
    </div>
  )
}