'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  rotation: number
}

interface CelebrationButtonProps {
  href: string
  className?: string
  children: React.ReactNode
}

const CONFETTI_COLORS = [
  '#14b8a6', // primary
  '#fbbf24', // yellow
  '#f472b6', // pink
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#34d399', // green
  '#fb7185', // red
]

export default function CelebrationButton({ href, className = '', children }: CelebrationButtonProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const triggerConfetti = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    // Generate confetti pieces
    const pieces: ConfettiPiece[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100, // Random x position from -100 to 100
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 200,
      rotation: Math.random() * 360,
    }))
    
    setConfetti(pieces)
    
    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([])
      setIsAnimating(false)
    }, 1500)
  }, [isAnimating])

  return (
    <div className="relative inline-block">
      {/* Confetti container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm animate-confetti"
            style={{
              backgroundColor: piece.color,
              '--confetti-x': `${piece.x}px`,
              animationDelay: `${piece.delay}ms`,
              transform: `rotate(${piece.rotation}deg)`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <Link
        href={href}
        className={`${className} relative overflow-hidden group`}
        onClick={triggerConfetti}
        onMouseEnter={triggerConfetti}
      >
        {/* Sparkle effect on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <span className="relative flex items-center gap-2">
          {children}
        </span>
      </Link>
    </div>
  )
}