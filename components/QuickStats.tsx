'use client'

import { useState, useEffect } from 'react'

interface StatsData {
  coursesViewed: number
  lessonsCompleted: number
  totalMinutes: number
  certificatesEarned: number
}

const STORAGE_KEY = 'learnhub_stats'

export default function QuickStats() {
  const [stats, setStats] = useState<StatsData>({
    coursesViewed: 0,
    lessonsCompleted: 0,
    totalMinutes: 0,
    certificatesEarned: 0,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setStats(JSON.parse(stored))
    } else {
      // Demo data for new users to see the feature
      const demoStats: StatsData = {
        coursesViewed: 3,
        lessonsCompleted: 12,
        totalMinutes: 245,
        certificatesEarned: 1,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStats))
      setStats(demoStats)
    }
    setIsLoaded(true)
  }, [])

  const statItems = [
    { 
      icon: '📚', 
      label: 'Courses Started', 
      value: stats.coursesViewed,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: '✅', 
      label: 'Lessons Done', 
      value: stats.lessonsCompleted,
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: '⏱️', 
      label: 'Minutes Learned', 
      value: stats.totalMinutes,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: '🏅', 
      label: 'Achievements', 
      value: stats.certificatesEarned,
      color: 'from-yellow-500 to-yellow-600'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={item.label}
          className={`card p-4 text-center transition-all duration-500 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
            {item.value.toLocaleString()}
          </div>
          <div className="text-xs text-navy-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  )
}