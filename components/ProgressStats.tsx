'use client'

import { useState, useEffect } from 'react'

interface Stats {
  lessonsViewed: number
  coursesExplored: number
  timeSpentMinutes: number
  favoriteCategory: string
}

const defaultStats: Stats = {
  lessonsViewed: 0,
  coursesExplored: 0,
  timeSpentMinutes: 0,
  favoriteCategory: 'Web Development',
}

export default function ProgressStats() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-stats')
    if (stored) {
      setStats(JSON.parse(stored))
    }
    // Trigger animation after mount
    setTimeout(() => setAnimated(true), 100)
  }, [])

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const statsDisplay = [
    {
      icon: '📖',
      label: 'Lessons Viewed',
      value: stats.lessonsViewed,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🎓',
      label: 'Courses Explored',
      value: stats.coursesExplored,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '⏱️',
      label: 'Time Learning',
      value: formatTime(stats.timeSpentMinutes),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '⭐',
      label: 'Focus Area',
      value: stats.favoriteCategory || 'Exploring',
      color: 'from-orange-500 to-orange-600',
      isText: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsDisplay.map((stat, index) => (
        <div
          key={stat.label}
          className={`card p-4 text-center transform transition-all duration-500 ${
            animated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div 
            className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums`}
          >
            {stat.isText ? (
              <span className="text-lg">{stat.value}</span>
            ) : (
              stat.value
            )}
          </div>
          <div className="text-xs text-navy-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}