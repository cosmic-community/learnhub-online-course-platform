'use client'

import { useEffect, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotationSpeed: number
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = ['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171']

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 2 + Math.random() * 3,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    return newParticles
  }, [])

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      setParticles(createParticles())

      // Animation cleanup after 4 seconds
      const timeout = setTimeout(() => {
        setIsActive(false)
        setParticles([])
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timeout)
    }
  }, [trigger, isActive, createParticles, onComplete])

  useEffect(() => {
    if (!isActive || particles.length === 0) return

    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX,
            rotation: p.rotation + p.rotationSpeed,
            speedY: p.speedY + 0.1, // gravity
          }))
          .filter((p) => p.y < 120) // Remove particles that fall off screen
      )
    }, 16)

    return () => clearInterval(animationInterval)
  }, [isActive, particles.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
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
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            opacity: Math.max(0, 1 - particle.y / 100),
          }}
        />
      ))}
    </div>
  )
}

// Hook to trigger confetti from anywhere
export function useConfetti() {
  const [shouldTrigger, setShouldTrigger] = useState(false)

  const celebrate = useCallback(() => {
    setShouldTrigger(true)
  }, [])

  const reset = useCallback(() => {
    setShouldTrigger(false)
  }, [])

  return { shouldTrigger, celebrate, reset }
}