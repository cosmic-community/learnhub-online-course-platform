'use client'

import { useEffect, useState, useCallback } from 'react'

interface Particle {
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

interface ConfettiCelebrationProps {
  isActive: boolean
  onComplete?: () => void
}

const COLORS = ['#29ABE2', '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ConfettiCelebration({ isActive, onComplete }: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        velocityX: (Math.random() - 0.5) * 3,
        velocityY: 2 + Math.random() * 3,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    setParticles(createParticles())

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          y: p.y + p.velocityY,
          x: p.x + p.velocityX,
          rotation: p.rotation + p.rotationSpeed,
          velocityY: p.velocityY + 0.1, // gravity
        })).filter(p => p.y < 120)

        if (updated.length === 0) {
          clearInterval(interval)
          onComplete?.()
        }

        return updated
      })
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, createParticles, onComplete])

  if (!isActive && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}