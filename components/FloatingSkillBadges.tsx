'use client'

import { useEffect, useState } from 'react'

interface SkillBadge {
  id: number
  emoji: string
  label: string
  x: number
  y: number
  delay: number
  duration: number
}

const skills: Omit<SkillBadge, 'x' | 'y' | 'delay' | 'duration'>[] = [
  { id: 1, emoji: '⚛️', label: 'React' },
  { id: 2, emoji: '🟢', label: 'Vue.js' },
  { id: 3, emoji: '📘', label: 'TypeScript' },
  { id: 4, emoji: '🟨', label: 'JavaScript' },
  { id: 5, emoji: '☁️', label: 'AWS' },
  { id: 6, emoji: '🐍', label: 'Python' },
  { id: 7, emoji: '🎨', label: 'CSS' },
  { id: 8, emoji: '📱', label: 'Mobile' },
  { id: 9, emoji: '🗃️', label: 'Database' },
  { id: 10, emoji: '🔐', label: 'Security' },
]

export default function FloatingSkillBadges() {
  const [badges, setBadges] = useState<SkillBadge[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Generate random positions for badges
    const generatedBadges = skills.map((skill, index) => ({
      ...skill,
      // Distribute badges around the edges of the hero section
      x: index < 5 
        ? 5 + (index * 5) // Left side
        : 75 + ((index - 5) * 5), // Right side
      y: 10 + (index % 5) * 18,
      delay: index * 0.2,
      duration: 3 + (index % 3),
    }))
    
    setBadges(generatedBadges)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="absolute opacity-0 animate-float-in"
          style={{
            left: `${badge.x}%`,
            top: `${badge.y}%`,
            animationDelay: `${badge.delay}s`,
            animationDuration: `${badge.duration}s`,
          }}
        >
          <div className="px-3 py-2 bg-navy-800/80 backdrop-blur-sm border border-navy-700/50 rounded-lg flex items-center gap-2 shadow-lg animate-float">
            <span className="text-lg">{badge.emoji}</span>
            <span className="text-sm text-navy-300 font-medium">{badge.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}