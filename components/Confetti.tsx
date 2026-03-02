'use client'

import { useEffect, useState } from 'react'

interface ConfettiProps {
  isActive: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
  emoji: string
}

const EMOJIS = ['🎉', '⭐', '✨', '🎊', '🏆', '💫', '🌟', '🔥']
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (isActive) {
      // Create particles
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 10 + Math.random() * 20,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 2 + Math.random() * 3,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      }))
      
      setParticles(newParticles)

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isActive, onComplete])

  if (!isActive && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${2 + Math.random()}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  )
}