'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

const COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
]

const EMOJIS = ['🎉', '✨', '🌟', '💫', '🔥', '💪', '🚀', '⭐']

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([])

  useEffect(() => {
    // Generate confetti particles
    const newParticles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 4 + Math.random() * 8,
      })
    }
    setParticles(newParticles)

    // Generate emoji particles
    const newEmojis = []
    for (let i = 0; i < 15; i++) {
      newEmojis.push({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.8,
      })
    }
    setEmojis(newEmojis)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Emoji particles */}
      {emojis.map((emoji) => (
        <div
          key={`emoji-${emoji.id}`}
          className="absolute text-2xl animate-emoji-float"
          style={{
            left: `${emoji.x}%`,
            bottom: '-50px',
            animationDelay: `${emoji.delay}s`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  )
}