'use client'

import { useState, useEffect, useCallback } from 'react'

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

const colors = [
  '#6366f1', // primary
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
]

export default function ConfettiCelebration() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [shouldShow, setShouldShow] = useState(false)

  const createParticle = useCallback((id: number): Particle => {
    return {
      id,
      x: Math.random() * 100, // percentage across screen
      y: -10, // start above screen
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: Math.random() * 2 + 1,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }, [])

  useEffect(() => {
    // Check if this is a returning visitor (visited before but not today's session)
    const lastSession = sessionStorage.getItem('learnhub-session')
    const hasVisitedBefore = localStorage.getItem('learnhub-streak')
    
    if (!lastSession && hasVisitedBefore) {
      // Returning visitor in a new session - celebrate!
      setShouldShow(true)
      sessionStorage.setItem('learnhub-session', 'active')
      
      // Create confetti burst
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push(createParticle(i))
      }
      setParticles(newParticles)
      
      // Clean up after animation
      setTimeout(() => {
        setShouldShow(false)
        setParticles([])
      }, 4000)
    } else if (!lastSession) {
      // First time visitor
      sessionStorage.setItem('learnhub-session', 'active')
    }
  }, [createParticle])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX * 0.1,
            y: p.y + p.velocityY * 0.3,
            rotation: p.rotation + p.rotationSpeed,
            velocityY: p.velocityY + 0.02, // gravity
          }))
          .filter(p => p.y < 120) // remove particles that fell off screen
      )
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [particles.length])

  if (!shouldShow || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            opacity: Math.max(0, 1 - particle.y / 100),
          }}
        />
      ))}
    </div>
  )
}