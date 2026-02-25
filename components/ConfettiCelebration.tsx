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
}

const COLORS = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#22c55e', '#ec4899']

export default function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      // Create confetti particles
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 20,
          y: 50,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          velocityX: (Math.random() - 0.5) * 15,
          velocityY: -10 - Math.random() * 10,
        })
      }
      setParticles(newParticles)
      
      // Clear after animation
      setTimeout(() => {
        setParticles([])
        setIsActive(false)
      }, 3000)
    }
  }, [trigger, isActive])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animationDelay: `${index * 20}ms`,
            '--velocity-x': `${particle.velocityX}vw`,
            '--velocity-y': `${particle.velocityY}vh`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}