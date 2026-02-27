'use client'

import { useState, useEffect, useCallback } from 'react'

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

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function WelcomeConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    // Check if this is a returning visitor today
    const lastConfetti = localStorage.getItem('learnhub-confetti-date')
    const today = new Date().toDateString()
    
    // Only show confetti once per day
    if (lastConfetti !== today) {
      localStorage.setItem('learnhub-confetti-date', today)
      setIsVisible(true)
      setParticles(createParticles())
      
      // Hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 4000)
      
      return () => clearTimeout(timer)
    }
  }, [createParticles])

  useEffect(() => {
    if (!isVisible || particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y + p.speedY,
          x: p.x + p.speedX,
          rotation: p.rotation + p.rotationSpeed,
        })).filter(p => p.y < 110)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isVisible, particles.length])

  if (!isVisible || particles.length === 0) return null

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
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            opacity: Math.max(0, 1 - particle.y / 100),
          }}
        />
      ))}
    </div>
  )
}