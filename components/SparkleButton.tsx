'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SparkleButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
}

export default function SparkleButton({ href, children, className = '' }: SparkleButtonProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const createSparkle = () => {
    const newSparkles: Sparkle[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
    }))
    
    setSparkles(newSparkles)
    
    setTimeout(() => {
      setSparkles([])
    }, 700)
  }

  return (
    <Link
      href={href}
      className={`relative overflow-hidden group ${className}`}
      onMouseEnter={createSparkle}
    >
      {/* Sparkle particles */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute pointer-events-none animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-yellow-300"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </span>
      ))}
      
      {/* Shine effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </Link>
  )
}