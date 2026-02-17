'use client'

import { useEffect, useState } from 'react'

const icons = ['💻', '🚀', '⭐', '📚', '🎯', '💡', '🔥', '✨']

interface FloatingIcon {
  id: number
  icon: string
  left: number
  delay: number
  duration: number
}

export default function FloatingElements() {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    const generatedIcons = icons.map((icon, index) => ({
      id: index,
      icon,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }))
    setFloatingIcons(generatedIcons)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingIcons.map((item) => (
        <div
          key={item.id}
          className="absolute text-2xl opacity-10 animate-float"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  )
}