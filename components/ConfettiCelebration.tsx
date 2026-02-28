'use client'

import { useState, useEffect, useCallback } from 'react'

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

const COLORS = ['#29ABE2', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899']

export default function ConfettiCelebration({ trigger, onComplete }: { trigger: boolean; onComplete?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 20,
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    if (!trigger) return

    const newParticles = createParticles()
    setParticles(newParticles)

    // Animation loop
    let animationId: number
    let startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime

      if (elapsed > 3000) {
        setParticles([])
        onComplete?.()
        return
      }

      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.velocityY * 0.5,
          x: p.x + p.velocityX * 0.3,
          rotation: p.rotation + p.rotationSpeed,
          velocityY: p.velocityY + 0.1, // gravity
        })).filter(p => p.y < 120) // remove particles that fell off screen
      )

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [trigger, createParticles, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}