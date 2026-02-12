'use client'

import { useEffect, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  shape: 'square' | 'circle' | 'triangle'
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const colors = [
    '#14b8a6', // primary
    '#2dd4bf',
    '#5eead4',
    '#fbbf24', // yellow
    '#f472b6', // pink
    '#a78bfa', // purple
    '#60a5fa', // blue
    '#34d399', // green
  ]

  const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle']

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      })
    }

    return newParticles
  }, [])

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)
    setParticles(createParticles())

    // Cleanup after animation
    const timeout = setTimeout(() => {
      setIsActive(false)
      setParticles([])
      onComplete?.()
    }, 4000)

    return () => clearTimeout(timeout)
  }, [trigger, createParticles, onComplete])

  useEffect(() => {
    if (!isActive || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            rotation: p.rotation + p.rotationSpeed,
          }))
          .filter(p => p.y < window.innerHeight + 50)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, particles.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.shape !== 'triangle' ? particle.color : 'transparent',
            borderRadius: particle.shape === 'circle' ? '50%' : '0',
            transform: `rotate(${particle.rotation}deg)`,
            borderLeft: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
            borderRight: particle.shape === 'triangle' ? `${particle.size / 2}px solid transparent` : undefined,
            borderBottom: particle.shape === 'triangle' ? `${particle.size}px solid ${particle.color}` : undefined,
          }}
        />
      ))}
      
      {/* Celebration text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-bounce">
          <div className="text-6xl mb-4">🎉</div>
          <div className="text-2xl font-bold text-white drop-shadow-lg">
            Amazing Progress!
          </div>
        </div>
      </div>
    </div>
  )
}