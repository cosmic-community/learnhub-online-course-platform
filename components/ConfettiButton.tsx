'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  velocity: number
}

interface ConfettiButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function ConfettiButton({ href, children, className = '' }: ConfettiButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isHovered, setIsHovered] = useState(false)

  const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#f59e0b', '#ec4899', '#8b5cf6']

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        velocity: 3 + Math.random() * 3
      })
    }
    setParticles(newParticles)

    // Clear particles after animation
    setTimeout(() => setParticles([]), 1000)
  }, [])

  return (
    <div className="relative inline-block">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute pointer-events-none animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${particle.angle}rad)`,
            '--angle': `${particle.angle}rad`,
            '--velocity': particle.velocity,
          } as React.CSSProperties}
        />
      ))}
      
      <Link 
        href={href}
        className={`
          ${className}
          relative overflow-visible
          ${isHovered ? 'scale-105' : 'scale-100'}
          transition-transform duration-200
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={createParticles}
      >
        {children}
        
        {/* Sparkle effect on hover */}
        {isHovered && (
          <>
            <span className="absolute -top-1 -right-1 text-sm animate-ping">✨</span>
            <span className="absolute -bottom-1 -left-1 text-sm animate-ping" style={{ animationDelay: '0.2s' }}>✨</span>
          </>
        )}
      </Link>
    </div>
  )
}