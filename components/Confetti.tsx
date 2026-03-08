'use client'

import { useEffect, useState, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  speedY: number
  speedX: number
  speedRotation: number
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  particleCount?: number
  onComplete?: () => void
}

const COLORS = ['#F97316', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#FBBF24', '#06B6D4']

export default function Confetti({ 
  isActive, 
  duration = 3000, 
  particleCount = 50,
  onComplete 
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scale: 0.5 + Math.random() * 0.5,
        speedY: 2 + Math.random() * 3,
        speedX: -2 + Math.random() * 4,
        speedRotation: -5 + Math.random() * 10,
      })
    }
    return newParticles
  }, [particleCount])

  useEffect(() => {
    if (isActive) {
      setParticles(createParticles())
      setIsVisible(true)

      const timeout = setTimeout(() => {
        setIsVisible(false)
        setParticles([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [isActive, duration, createParticles, onComplete])

  useEffect(() => {
    if (!isVisible || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speedY,
          x: p.x + p.speedX,
          rotation: p.rotation + p.speedRotation,
        })).filter(p => p.y < 120)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isVisible, particles.length])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl animate-bounce">🎉</div>
      </div>
    </div>
  )
}