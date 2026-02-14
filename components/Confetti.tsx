'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  size: number
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (trigger) {
      const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#818cf8', '#34d399']
      const newPieces: ConfettiPiece[] = []
      
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          size: Math.random() * 8 + 4,
        })
      }
      
      setPieces(newPieces)
      setIsVisible(true)
      
      // Clean up after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
        setPieces([])
        onComplete?.()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!isVisible || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        >
          <div
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        </div>
      ))}
    </div>
  )
}