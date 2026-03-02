'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
}

const COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']

export default function ConfettiExplosion() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    for (let i = 0; i < 100; i++) {
      const angle = (Math.random() * Math.PI * 2)
      const speed = 3 + Math.random() * 8
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20
      })
    }
    setParticles(newParticles)

    // Animate particles
    let animationFrame: number
    let startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > 3000) {
        setParticles([])
        return
      }

      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.speedX,
        y: p.y + p.speedY + (elapsed / 200), // gravity
        speedX: p.speedX * 0.99,
        speedY: p.speedY + 0.2,
        rotation: p.rotation + p.rotationSpeed
      })))

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size * 0.6,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: '2px',
            opacity: 1 - (particle.y / window.innerHeight) * 0.5
          }}
        />
      ))}
    </div>
  )
}