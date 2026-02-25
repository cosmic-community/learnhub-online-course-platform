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
}

export default function ConfettiCelebration() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
      })
    }
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    const handleCelebrate = () => {
      setIsVisible(true)
      createParticles()
      
      // Hide after animation
      setTimeout(() => {
        setIsVisible(false)
        setParticles([])
      }, 4000)
    }

    // Listen for custom celebration event
    window.addEventListener('lesson-completed', handleCelebrate)
    
    return () => window.removeEventListener('lesson-completed', handleCelebrate)
  }, [createParticles])

  useEffect(() => {
    if (!isVisible || particles.length === 0) return

    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.velocityY,
        x: p.x + p.velocityX,
        rotation: p.rotation + 5,
        velocityY: p.velocityY + 0.1, // gravity
      })).filter(p => p.y < window.innerHeight + 50))
      
      if (particles.some(p => p.y < window.innerHeight + 50)) {
        requestAnimationFrame(animate)
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, particles])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center animate-bounce">
        <div className="text-6xl mb-2">🎉</div>
        <div className="text-2xl font-bold text-white">Lesson Complete!</div>
        <div className="text-primary-400">Great job! Keep learning!</div>
      </div>
    </div>
  )
}