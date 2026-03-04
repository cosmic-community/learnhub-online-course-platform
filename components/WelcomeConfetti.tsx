'use client'

import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  scale: number
  speedX: number
  speedY: number
  rotationSpeed: number
}

const colors = [
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#F59E0B', // yellow
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
]

export default function WelcomeConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.5 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 2,
        speedY: 2 + Math.random() * 3,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    return newParticles
  }, [])

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('learnhub-welcomed')
    
    if (!hasVisited) {
      // First time visitor - show confetti!
      localStorage.setItem('learnhub-welcomed', 'true')
      setIsActive(true)
      setParticles(createParticles())

      // Stop after animation
      const timer = setTimeout(() => {
        setIsActive(false)
        setParticles([])
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [createParticles])

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
          .filter(p => p.y < 120) // remove off-screen particles
      )
    }, 16)

    return () => clearInterval(interval)
  }, [isActive, particles.length])

  if (!isActive || particles.length === 0) return null

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
      
      {/* Welcome message that fades in */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-fade-in-up">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">
          Welcome to LearnHub!
        </h2>
      </div>
    </div>
  )
}