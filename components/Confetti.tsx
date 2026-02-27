'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if we should show confetti (once per session on first visit)
    const hasSeenConfetti = sessionStorage.getItem('hasSeenConfetti')
    
    if (!hasSeenConfetti) {
      setIsVisible(true)
      sessionStorage.setItem('hasSeenConfetti', 'true')

      // Generate confetti pieces
      const colors = ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6', '#a78bfa']
      const newPieces: ConfettiPiece[] = []

      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
          size: 8 + Math.random() * 8
        })
      }

      setPieces(newPieces)

      // Hide confetti after animation
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  )
}