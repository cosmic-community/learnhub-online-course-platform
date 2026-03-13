'use client'

import { useEffect, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  speedX: number
  speedY: number
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = ['#00D4FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181']

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 15,
        speedY: -10 - Math.random() * 10
      })
    }
    setParticles(newParticles)

    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 3000)
  }, [onComplete])

  useEffect(() => {
    if (trigger) {
      createParticles()
    }
  }, [trigger, createParticles])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            '--speed-x': `${particle.speedX}vw`,
            '--speed-y': `${particle.speedY}vh`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}