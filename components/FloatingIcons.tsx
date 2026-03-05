'use client'

import { useEffect, useState } from 'react'

const icons = ['💻', '📚', '🎯', '⚡', '🚀', '✨', '🔥', '💡', '🎨', '⭐']

interface FloatingIcon {
  id: number
  emoji: string
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function FloatingIcons() {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    // Generate random floating icons
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = []
      for (let i = 0; i < 12; i++) {
        newIcons.push({
          id: i,
          emoji: icons[Math.floor(Math.random() * icons.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 24 + Math.random() * 24,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 5,
        })
      }
      setFloatingIcons(newIcons)
    }

    generateIcons()
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute opacity-10 animate-float"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: `${icon.size}px`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
          }}
        >
          {icon.emoji}
        </div>
      ))}
    </div>
  )
}