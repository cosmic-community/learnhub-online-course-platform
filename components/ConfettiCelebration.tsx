'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedY: number
  speedX: number
  speedRotation: number
}

interface ConfettiCelebrationProps {
  trigger: boolean
  onComplete?: () => void
}

const COLORS = [
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
]

export default function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)
      
      // Create particles
      const newParticles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 4,
        speedRotation: (Math.random() - 0.5) * 10,
      }))
      
      setParticles(newParticles)

      // Animation loop
      let animationFrame: number
      const animate = () => {
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX,
            rotation: p.rotation + p.speedRotation,
            speedY: p.speedY + 0.1, // gravity
          })).filter(p => p.y < 120)
        )
        
        animationFrame = requestAnimationFrame(animate)
      }
      
      animationFrame = requestAnimationFrame(animate)

      // Cleanup after animation
      const timeout = setTimeout(() => {
        setIsActive(false)
        setParticles([])
        onComplete?.()
      }, 4000)

      return () => {
        cancelAnimationFrame(animationFrame)
        clearTimeout(timeout)
      }
    }
  }, [trigger, isActive, onComplete])

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
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            opacity: Math.max(0, 1 - particle.y / 100),
          }}
        />
      ))}
    </div>
  )
}