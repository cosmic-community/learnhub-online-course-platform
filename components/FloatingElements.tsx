'use client'

import { useEffect, useState } from 'react'

interface FloatingElement {
  id: number
  emoji: string
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  const emojis = ['📚', '💻', '🎯', '⭐', '🚀', '💡', '🎓', '📊', '🔥', '✨']

  useEffect(() => {
    const newElements: FloatingElement[] = []
    
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
      })
    }
    
    setElements(newElements)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {elements.map(el => (
        <div
          key={el.id}
          className="absolute animate-float"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}rem`,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  )
}