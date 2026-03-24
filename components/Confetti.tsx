'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
  size: number
}

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

const COLORS = [
  '#60A5FA', // blue
  '#34D399', // green
  '#FBBF24', // yellow
  '#F472B6', // pink
  '#A78BFA', // purple
  '#FB923C', // orange
]

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  
  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 8,
      }))
      
      setPieces(newPieces)
      
      const timer = setTimeout(() => {
        setPieces([])
        onComplete?.()
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [active, onComplete])
  
  if (!active || pieces.length === 0) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}