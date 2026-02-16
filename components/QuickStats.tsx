'use client'

import { useState, useEffect } from 'react'

interface StatsData {
  lessonsCompleted: number
  minutesLearned: number
  coursesStarted: number
}

const STATS_KEY = 'learnhub_stats'

export default function QuickStats() {
  const [stats, setStats] = useState<StatsData>({
    lessonsCompleted: 0,
    minutesLearned: 0,
    coursesStarted: 0
  })
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STATS_KEY)
      if (stored) {
        try {
          setStats(JSON.parse(stored))
        } catch {
          // Use defaults
        }
      }
      // Trigger animation
      setTimeout(() => setAnimated(true), 200)
    }
  }, [])

  const statItems = [
    {
      label: 'Lessons Completed',
      value: stats.lessonsCompleted,
      icon: '📝',
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Minutes Learned',
      value: stats.minutesLearned,
      icon: '⏱️',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Courses Started',
      value: stats.coursesStarted,
      icon: '🚀',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.label}
          className={`card p-4 text-center transition-all duration-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.bg} mb-2`}>
            <span className="text-lg">{item.icon}</span>
          </div>
          <div className={`text-2xl font-bold ${item.color} tabular-nums`}>
            {item.value}
          </div>
          <div className="text-xs text-navy-400 mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}