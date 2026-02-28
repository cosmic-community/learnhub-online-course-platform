'use client'

import { useEffect, useState, useCallback } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
  rotationSpeed: number
}

interface ConfettiExplosionProps {
  onComplete?: () => void
}

const COLORS = [
  '#3B82F6', // primary blue
  '#60A5FA', // light blue
  '#22C55E', // green
  '#EAB308', // yellow
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#F97316', // orange
]

export default function ConfettiExplosion({ onComplete }: ConfettiExplosionProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isActive, setIsActive] = useState(true)

  const createPieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = []
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 3

    for (let i = 0; i < 100; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = 5 + Math.random() * 15
      
      newPieces.push({
        id: i,
        x: centerX,
        y: centerY,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 10,
        rotationSpeed: (Math.random() - 0.5) * 20,
      })
    }

    return newPieces
  }, [])

  useEffect(() => {
    setPieces(createPieces())

    const timeout = setTimeout(() => {
      setIsActive(false)
      onComplete?.()
    }, 3000)

    return () => clearTimeout(timeout)
  }, [createPieces, onComplete])

  useEffect(() => {
    if (!isActive || pieces.length === 0) return

    let animationFrame: number
    let lastTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = (currentTime - lastTime) / 16 // Normalize to ~60fps
      lastTime = currentTime

      setPieces(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.velocityX * deltaTime,
          y: piece.y + piece.velocityY * deltaTime,
          velocityY: piece.velocityY + 0.5 * deltaTime, // gravity
          rotation: piece.rotation + piece.rotationSpeed * deltaTime,
        })).filter(piece => piece.y < window.innerHeight + 50)
      )

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isActive, pieces.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}