'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  emoji: string
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const emojis = ['✨', '💫', '⭐', '🌟', '💡', '📚', '🎯', '🚀']
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 12; i++) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)] || '✨'
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        emoji: randomEmoji
      })
    }
    
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute opacity-20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}rem`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  )
}