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
  gravity: number
  friction: number
  opacity: number
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = ['#14b8a6', '#f97316', '#eab308', '#ec4899', '#8b5cf6', '#3b82f6']

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5,
        velocityX: (Math.random() - 0.5) * 15,
        velocityY: Math.random() * 3 + 2,
        gravity: 0.1,
        friction: 0.99,
        opacity: 1
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    if (trigger && !isAnimating) {
      setIsAnimating(true)
      setParticles(createParticles())
      
      const animationDuration = 3000
      setTimeout(() => {
        setIsAnimating(false)
        setParticles([])
        onComplete?.()
      }, animationDuration)
    }
  }, [trigger, isAnimating, createParticles, onComplete])

  useEffect(() => {
    if (!isAnimating || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.velocityX,
          y: p.y + p.velocityY,
          velocityY: p.velocityY + p.gravity,
          velocityX: p.velocityX * p.friction,
          rotation: p.rotation + 5,
          opacity: p.opacity - 0.01
        })).filter(p => p.opacity > 0 && p.y < window.innerHeight + 50)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isAnimating, particles.length])

  if (!isAnimating || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.opacity,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  )
}