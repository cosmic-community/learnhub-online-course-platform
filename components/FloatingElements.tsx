'use client'

import { useEffect, useState } from 'react'

const techIcons = ['⚛️', '🔷', '🟨', '🐍', '☁️', '🎨', '📱', '🔧', '💻', '🚀']

interface FloatingIcon {
  id: number
  icon: string
  left: number
  delay: number
  duration: number
}

export default function FloatingElements() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    // Generate random floating icons
    const newIcons: FloatingIcon[] = techIcons.map((icon, index) => ({
      id: index,
      icon,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }))
    setIcons(newIcons)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item) => (
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