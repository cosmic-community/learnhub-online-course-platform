'use client'

import { useState, useEffect } from 'react'

interface FeaturedBadgeProps {
  variant?: 'trending' | 'new' | 'popular' | 'bestseller'
}

const badges = {
  trending: { icon: '🚀', text: 'Trending', color: 'from-orange-500 to-red-500' },
  new: { icon: '✨', text: 'New', color: 'from-green-500 to-emerald-500' },
  popular: { icon: '⭐', text: 'Popular', color: 'from-yellow-500 to-amber-500' },
  bestseller: { icon: '🏆', text: 'Bestseller', color: 'from-purple-500 to-pink-500' },
}

export default function FeaturedBadge({ variant = 'trending' }: FeaturedBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const badge = badges[variant]

  useEffect(() => {
    // Subtle pulse animation every few seconds
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${badge.color} shadow-lg transition-transform duration-300 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}
    >
      <span className={isAnimating ? 'animate-bounce' : ''}>{badge.icon}</span>
      {badge.text}
    </span>
  )
}