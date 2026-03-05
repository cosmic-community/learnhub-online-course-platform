'use client'

import { useEffect, useState } from 'react'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  velocityX: number
  velocityY: number
}

const COLORS = [
  '#10B981', // primary green
  '#34D399', // lighter green
  '#6EE7B7', // even lighter
  '#FCD34D', // yellow
  '#F59E0B', // orange
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#3B82F6', // blue
]

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      // Create particles
      const newParticles: Particle[] = []
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: Math.random() * 3 + 2,
        })
      }
      setParticles(newParticles)

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([])
        setIsActive(false)
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [trigger, isActive, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${10 * particle.scale}px`,
            height: `${10 * particle.scale}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}