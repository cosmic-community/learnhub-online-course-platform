'use client'

import { useEffect, useState } from 'react'

interface FloatingEmoji {
  id: number
  emoji: string
  x: number
  delay: number
  duration: number
}

export default function FloatingEmojis() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([])

  useEffect(() => {
    const emojiList = ['📚', '💡', '🚀', '⭐', '🎯', '💪', '🔥', '✨']
    const newEmojis: FloatingEmoji[] = []
    
    for (let i = 0; i < 8; i++) {
      newEmojis.push({
        id: i,
        emoji: emojiList[i % emojiList.length],
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10
      })
    }
    
    setEmojis(newEmojis)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojis.map((emoji) => (
        <span
          key={emoji.id}
          className="absolute text-2xl opacity-20 animate-float"
          style={{
            left: `${emoji.x}%`,
            animationDelay: `${emoji.delay}s`,
            animationDuration: `${emoji.duration}s`,
          }}
        >
          {emoji.emoji}
        </span>
      ))}
    </div>
  )
}