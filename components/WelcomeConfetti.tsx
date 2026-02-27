'use client'

import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  velocity: { x: number; y: number }
}

const COLORS = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#818cf8', '#34d399']

export default function WelcomeConfetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    const particleCount = 50
    
    for (let i = 0; i < particleCount; i++) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: -20 - Math.random() * 100,
        size: 6 + Math.random() * 8,
        color: randomColor || '#14b8a6',
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: 2 + Math.random() * 3
        }
      })
    }
    
    return newParticles
  }, [])

  useEffect(() => {
    // Check if this is a "new" session (for demo purposes, show on each visit)
    const hasSeenConfetti = sessionStorage.getItem('learnhub_confetti_shown')
    
    if (!hasSeenConfetti) {
      setIsVisible(true)
      setParticles(createParticles())
      sessionStorage.setItem('learnhub_confetti_shown', 'true')
      
      // Start animation
      const animationFrame = requestAnimationFrame(animate)
      
      // Hide after animation
      const timeout = setTimeout(() => {
        setIsVisible(false)
        setParticles([])
      }, 4000)
      
      return () => {
        cancelAnimationFrame(animationFrame)
        clearTimeout(timeout)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const animate = useCallback(() => {
    setParticles(prev => {
      const updated = prev.map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        rotation: particle.rotation + 3,
        velocity: {
          x: particle.velocity.x * 0.99,
          y: particle.velocity.y + 0.1 // gravity
        }
      })).filter(p => p.y < (typeof window !== 'undefined' ? window.innerHeight + 50 : 1000))
      
      if (updated.length > 0) {
        requestAnimationFrame(animate)
      }
      
      return updated
    })
  }, [])

  if (!isVisible || particles.length === 0) {
    return null
  }

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
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            opacity: Math.max(0, 1 - particle.y / (typeof window !== 'undefined' ? window.innerHeight : 800))
          }}
        />
      ))}
      
      {/* Welcome message overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-24 animate-fade-in-out">
        <div className="bg-gradient-to-r from-primary-500/90 to-primary-600/90 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm">
          <p className="text-xl font-semibold flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            Welcome back to LearnHub!
            <span className="text-2xl">🚀</span>
          </p>
        </div>
      </div>
    </div>
  )
}