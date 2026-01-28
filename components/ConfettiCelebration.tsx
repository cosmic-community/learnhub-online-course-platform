'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  velocityX: number
  velocityY: number
  rotationSpeed: number
}

const colors = ['#14b8a6', '#f97316', '#8b5cf6', '#ec4899', '#22c55e', '#3b82f6', '#fbbf24']

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
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
          x: Math.random() * window.innerWidth,
          y: -20,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
          velocityX: (Math.random() - 0.5) * 15,
          velocityY: Math.random() * 3 + 5,
          rotationSpeed: (Math.random() - 0.5) * 10,
        })
      }
      setParticles(newParticles)

      // Clear particles after animation
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
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `confetti-fall 4s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            '--velocity-x': `${particle.velocityX}px`,
            '--velocity-y': `${particle.velocityY * 100}px`,
            '--rotation': `${particle.rotationSpeed * 100}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}