'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  delay: number
}

const colors = ['#29B7F7', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show confetti on first visit of the session
    const hasSeenConfetti = sessionStorage.getItem('learnhub-confetti-shown')
    
    if (!hasSeenConfetti) {
      setIsVisible(true)
      sessionStorage.setItem('learnhub-confetti-shown', 'true')

      // Generate particles
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0]!,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        delay: Math.random() * 0.5
      }))
      
      setParticles(newParticles)

      // Hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animationDelay: `${particle.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  )
}