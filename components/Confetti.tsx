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
  rotationSpeed: number
}

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

const colors = [
  '#10B981', // emerald
  '#6366F1', // indigo
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#EF4444', // red
  '#84CC16', // lime
]

export default function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const count = 100

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 4,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    return newParticles
  }, [])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      setParticles(createParticles())

      // Auto-complete after animation
      const timer = setTimeout(() => {
        setIsActive(false)
        setParticles([])
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [trigger, isActive, createParticles, onComplete])

  useEffect(() => {
    if (!isActive || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + p.rotationSpeed,
            speedY: p.speedY + 0.1, // gravity
          }))
          .filter(p => p.y < window.innerHeight + 50)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, particles.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
          }}
        >
          {Math.random() > 0.5 ? (
            // Rectangle confetti
            <div
              style={{
                width: 10,
                height: 6,
                backgroundColor: particle.color,
                borderRadius: 1,
              }}
            />
          ) : (
            // Circle confetti
            <div
              style={{
                width: 8,
                height: 8,
                backgroundColor: particle.color,
                borderRadius: '50%',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}