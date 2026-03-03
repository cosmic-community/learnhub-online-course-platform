'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
  rotation: number
  rotationSpeed: number
}

const colors = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#22D3EE']

export default function WelcomeConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem('learnhub-welcomed')
    
    if (!hasVisited) {
      sessionStorage.setItem('learnhub-welcomed', 'true')
      setIsActive(true)
      
      // Create initial particles
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 8,
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: 2 + Math.random() * 3
          },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10
        })
      }
      setParticles(newParticles)
      
      // Clean up after animation
      const timeout = setTimeout(() => {
        setIsActive(false)
        setParticles([])
      }, 4000)
      
      return () => clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!isActive || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x * 0.1,
            y: p.y + p.velocity.y * 0.3,
            rotation: p.rotation + p.rotationSpeed,
            velocity: {
              ...p.velocity,
              y: p.velocity.y + 0.1 // gravity
            }
          }))
          .filter(p => p.y < 120) // Remove particles below viewport
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
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${particle.rotation}deg)`,
            opacity: Math.max(0, 1 - particle.y / 100),
            transition: 'opacity 0.1s'
          }}
        />
      ))}
    </div>
  )
}