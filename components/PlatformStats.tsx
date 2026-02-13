'use client'

import { useEffect, useState } from 'react'

interface PlatformStatsProps {
  coursesCount: number
  instructorsCount: number
  totalHours: number
  totalLessons: number
}

export default function PlatformStats({ coursesCount, instructorsCount, totalHours, totalLessons }: PlatformStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  const stats = [
    { emoji: '📚', value: `${coursesCount}+`, label: 'courses available' },
    { emoji: '👨‍🏫', value: `${instructorsCount}`, label: 'expert instructors' },
    { emoji: '⏱️', value: `${totalHours}h+`, label: 'of content' },
    { emoji: '📖', value: `${totalLessons}`, label: 'lessons to explore' },
    { emoji: '🌍', value: '24/7', label: 'learning access' },
    { emoji: '🎓', value: '100%', label: 'online learning' },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <div className={`
      bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 
      border-b border-navy-800 overflow-hidden
      transition-all duration-500
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-navy-400 hidden sm:inline">📊 Platform Stats:</span>
          
          {/* Mobile: Single rotating stat */}
          <div className="sm:hidden flex items-center gap-2">
            <span className="animate-bounce-slow">{stats[currentStatIndex].emoji}</span>
            <span className="text-white font-semibold">{stats[currentStatIndex].value}</span>
            <span className="text-navy-400">{stats[currentStatIndex].label}</span>
          </div>

          {/* Desktop: Scrolling ticker */}
          <div className="hidden sm:block overflow-hidden relative w-full max-w-2xl">
            <div className="flex animate-ticker">
              {[...stats, ...stats].map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 px-6 whitespace-nowrap"
                >
                  <span>{stat.emoji}</span>
                  <span className="text-white font-semibold">{stat.value}</span>
                  <span className="text-navy-400">{stat.label}</span>
                  <span className="text-navy-700 ml-4">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}