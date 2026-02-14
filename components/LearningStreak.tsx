'use client'

import { useState, useEffect } from 'react'

const motivationalMessages = [
  { days: 1, message: "Great start! Every journey begins with a single step. 🚀", emoji: "🌱" },
  { days: 2, message: "Day 2! You're building momentum! 💪", emoji: "🔥" },
  { days: 3, message: "3 days strong! Consistency is key! 🔑", emoji: "⭐" },
  { days: 5, message: "5 day streak! You're on fire! 🔥", emoji: "🏆" },
  { days: 7, message: "One week! You're a learning machine! 🎯", emoji: "👑" },
  { days: 14, message: "2 weeks! You're unstoppable! 🚀", emoji: "💎" },
  { days: 30, message: "30 days! You're a legend! 🏅", emoji: "🌟" },
]

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocity: { x: number; y: number }
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showBanner, setShowBanner] = useState(false)
  const [isNewStreak, setIsNewStreak] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get stored streak data
    const storedData = localStorage.getItem('learningStreak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const { lastVisit, currentStreak } = JSON.parse(storedData)
      const lastVisitDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastVisitDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        // Same day visit
        setStreak(currentStreak)
        setShowBanner(true)
      } else if (diffDays === 1) {
        // Consecutive day - increase streak!
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        setIsNewStreak(true)
        setShowBanner(true)
        localStorage.setItem('learningStreak', JSON.stringify({
          lastVisit: today,
          currentStreak: newStreak
        }))
        
        // Trigger celebration for milestones
        if ([3, 5, 7, 14, 30].includes(newStreak)) {
          triggerCelebration()
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        setIsNewStreak(true)
        setShowBanner(true)
        localStorage.setItem('learningStreak', JSON.stringify({
          lastVisit: today,
          currentStreak: 1
        }))
      }
    } else {
      // First visit ever
      setStreak(1)
      setIsNewStreak(true)
      setShowBanner(true)
      localStorage.setItem('learningStreak', JSON.stringify({
        lastVisit: today,
        currentStreak: 1
      }))
    }
    
    // Auto-hide banner after 8 seconds
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 8000)
    
    return () => clearTimeout(timer)
  }, [])

  const triggerCelebration = () => {
    const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#22c55e']
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 3 + 2
        }
      })
    }
    
    setParticles(newParticles)
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
    }, 4000)
  }

  const getMessage = () => {
    const sorted = [...motivationalMessages].sort((a, b) => b.days - a.days)
    for (const msg of sorted) {
      if (streak >= msg.days) {
        return msg
      }
    }
    return motivationalMessages[0]
  }

  if (!mounted || !showBanner) return null

  const currentMessage = getMessage()

  return (
    <>
      {/* Confetti Particles */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-confetti"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                '--vx': particle.velocity.x,
                '--vy': particle.velocity.y,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      
      {/* Streak Banner */}
      <div 
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-teal-400 rounded-2xl shadow-2xl shadow-primary-500/30 p-4 px-6 max-w-md mx-4">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-teal-400 rounded-2xl blur-xl opacity-30 -z-10" />
          
          <button
            onClick={() => setShowBanner(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center text-navy-400 hover:text-white transition-colors shadow-lg"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            {/* Streak Fire Icon */}
            <div className="relative">
              <div className="text-4xl animate-bounce-slow">
                {currentMessage.emoji}
              </div>
              {isNewStreak && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-navy-900 animate-pulse">
                  +1
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/90 text-sm font-medium">Learning Streak</span>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                  <span className="text-lg">🔥</span>
                  <span className="text-white font-bold">{streak}</span>
                  <span className="text-white/80 text-xs">day{streak !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <p className="text-white text-sm font-medium">
                {currentMessage.message}
              </p>
            </div>
          </div>
          
          {/* Progress to next milestone */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>Progress to next milestone</span>
              <span>{getNextMilestone(streak)}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage(streak)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function getNextMilestone(current: number): string {
  const milestones = [3, 5, 7, 14, 30]
  for (const m of milestones) {
    if (current < m) {
      return `${m - current} day${m - current !== 1 ? 's' : ''} to ${m}-day streak!`
    }
  }
  return "You're a champion! 🏆"
}

function getProgressPercentage(current: number): number {
  const milestones = [0, 3, 5, 7, 14, 30]
  for (let i = 0; i < milestones.length - 1; i++) {
    const prev = milestones[i]
    const next = milestones[i + 1]
    if (current >= prev && current < next) {
      return ((current - prev) / (next - prev)) * 100
    }
  }
  return 100
}