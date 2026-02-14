'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  velocity: { x: number; y: number }
  rotationSpeed: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

const COLORS = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa', '#60a5fa']

export default function Confetti({ isActive, duration = 3000, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  const createPiece = useCallback((id: number): ConfettiPiece => ({
    id,
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0],
    velocity: {
      x: (Math.random() - 0.5) * 3,
      y: 3 + Math.random() * 2
    },
    rotationSpeed: (Math.random() - 0.5) * 10
  }), [])

  useEffect(() => {
    if (!isActive) {
      setPieces([])
      return
    }

    // Create initial burst
    const initialPieces = Array.from({ length: 50 }, (_, i) => createPiece(i))
    setPieces(initialPieces)

    // Animation loop
    let animationId: number
    let lastTime = Date.now()
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const delta = (now - lastTime) / 16 // Normalize to ~60fps
      lastTime = now

      if (now - startTime > duration) {
        setPieces([])
        onComplete?.()
        return
      }

      setPieces(prev => 
        prev
          .map(piece => ({
            ...piece,
            x: piece.x + piece.velocity.x * delta * 0.5,
            y: piece.y + piece.velocity.y * delta * 0.5,
            rotation: piece.rotation + piece.rotationSpeed * delta,
            velocity: {
              ...piece.velocity,
              y: piece.velocity.y + 0.1 * delta // Gravity
            }
          }))
          .filter(piece => piece.y < 120)
      )

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive, duration, onComplete, createPiece])

  if (!isActive && pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}