'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
  duration: number
  shape: 'square' | 'circle' | 'triangle'
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = [
  '#00C7B7', // primary
  '#7C3AED', // purple
  '#F59E0B', // yellow
  '#EF4444', // red
  '#10B981', // green
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F97316', // orange
]

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(false)

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle']
    
    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      })
    }
    return newPieces
  }, [])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      setPieces(generatePieces())
      
      const timeout = setTimeout(() => {
        setIsActive(false)
        setPieces([])
        onComplete?.()
      }, 4000)
      
      return () => clearTimeout(timeout)
    }
  }, [trigger, isActive, generatePieces, onComplete])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.shape === 'square' && (
            <div
              className="w-3 h-3"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'circle' && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: `10px solid ${piece.color}`,
              }}
            />
          )}
        </div>
      ))}
      
      {/* Celebration Message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-celebration-pop bg-gradient-to-r from-primary-500 to-purple-500 text-white text-2xl font-bold px-8 py-4 rounded-2xl shadow-2xl">
          🎉 Lesson Complete!
        </div>
      </div>
    </div>
  )
}