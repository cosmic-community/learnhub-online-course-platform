'use client'

import { useState, useEffect } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotationSpeed: number
}

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function ConfettiCelebration() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Check if this is a return visit with a streak
    const stored = localStorage.getItem('learning-streak')
    const celebrationShown = sessionStorage.getItem('celebration-shown')
    
    if (stored && !celebrationShown) {
      const data = JSON.parse(stored)
      const today = new Date().toDateString()
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      
      // Show celebration for streak milestones or returning users
      if (lastVisitDate === today && data.currentStreak >= 3) {
        sessionStorage.setItem('celebration-shown', 'true')
        triggerConfetti()
      }
    }
  }, [])

  const triggerConfetti = () => {
    setIsActive(true)
    
    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#3B82F6',
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 10
      })
    }
    setParticles(newParticles)
    
    // Clean up after animation
    setTimeout(() => {
      setIsActive(false)
      setParticles([])
    }, 4000)
  }

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )
}