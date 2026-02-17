'use client'

import { useEffect, useState, useCallback } from 'react'

interface Confetti {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
  scale: number
}

export default function ConfettiCelebration() {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const generateConfetti = useCallback(() => {
    const colors = [
      '#14b8a6', // primary
      '#fbbf24', // yellow
      '#f472b6', // pink
      '#60a5fa', // blue
      '#a78bfa', // purple
      '#34d399', // green
    ]
    
    const newConfetti: Confetti[] = []
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      })
    }
    
    setConfetti(newConfetti)
    setIsVisible(true)
    
    // Hide after animation
    setTimeout(() => {
      setIsVisible(false)
      setConfetti([])
    }, 4000)
  }, [])

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('learnhub_visited')
    
    if (!hasVisited) {
      // First visit in this session - show confetti!
      sessionStorage.setItem('learnhub_visited', 'true')
      
      // Small delay for page to load
      setTimeout(generateConfetti, 500)
    }
  }, [generateConfetti])

  if (!isVisible || confetti.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
          }}
        >
          <div 
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: piece.color }}
          />
        </div>
      ))}
      
      {/* Welcome message */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center animate-fade-in-up">
        <div className="bg-navy-900/90 backdrop-blur-lg rounded-2xl px-8 py-6 border border-primary-500/30 shadow-2xl">
          <span className="text-4xl block mb-2">🎉</span>
          <p className="text-white font-bold text-xl">Welcome to LearnHub!</p>
          <p className="text-navy-300 text-sm">Let's start your learning journey</p>
        </div>
      </div>
    </div>
  )
}