'use client'

import { useEffect, useState } from 'react'

interface TrendingBadgeProps {
  variant?: 'fire' | 'new' | 'popular'
}

export default function TrendingBadge({ variant = 'fire' }: TrendingBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const badges = {
    fire: {
      icon: '🔥',
      text: 'Trending',
      className: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    new: {
      icon: '✨',
      text: 'New',
      className: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    popular: {
      icon: '⭐',
      text: 'Popular',
      className: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    }
  }

  const badge = badges[variant]

  return (
    <span 
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white
        ${badge.className}
        ${isAnimating ? 'scale-110' : 'scale-100'}
        transition-transform duration-300 ease-out
        shadow-lg
      `}
    >
      <span className={isAnimating ? 'animate-bounce' : ''}>{badge.icon}</span>
      {badge.text}
    </span>
  )
}