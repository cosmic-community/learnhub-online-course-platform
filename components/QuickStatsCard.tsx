'use client'

import { useState, useEffect } from 'react'

interface QuickStats {
  coursesViewed: number
  lessonsCompleted: number
  totalMinutesLearned: number
  favoriteCategory: string | null
}

const STORAGE_KEY = 'learnhub_stats'

function getStats(): QuickStats {
  if (typeof window === 'undefined') {
    return {
      coursesViewed: 0,
      lessonsCompleted: 0,
      totalMinutesLearned: 0,
      favoriteCategory: null
    }
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  
  return {
    coursesViewed: 0,
    lessonsCompleted: 0,
    totalMinutesLearned: 0,
    favoriteCategory: null
  }
}

export default function QuickStatsCard() {
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const currentStats = getStats()
    
    // Simulate some engagement for demo purposes
    // In a real app, this would be tracked through user actions
    if (currentStats.coursesViewed === 0) {
      currentStats.coursesViewed = 1
      currentStats.totalMinutesLearned = 5
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStats))
    }
    
    setStats(currentStats)
  }, [])

  if (!stats) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-32 bg-navy-800 rounded"></div>
      </div>
    )
  }

  const formatMinutes = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const statItems = [
    {
      label: 'Courses Explored',
      value: stats.coursesViewed,
      icon: '📚',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Lessons Completed',
      value: stats.lessonsCompleted,
      icon: '✅',
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Time Invested',
      value: formatMinutes(stats.totalMinutesLearned),
      icon: '⏱️',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📊</span> Your Learning Stats
        </h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-navy-400 hover:text-primary-400 transition-colors"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="text-center group"
          >
            <div className={`
              w-16 h-16 mx-auto mb-3 rounded-2xl 
              bg-gradient-to-br ${item.color} 
              flex items-center justify-center text-2xl
              transform group-hover:scale-110 transition-transform duration-300
              shadow-lg
            `}>
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-white">
              {item.value}
            </div>
            <div className="text-xs text-navy-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {showDetails && (
        <div className="mt-6 pt-6 border-t border-navy-800 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-400">Average session</span>
              <span className="text-white font-medium">
                {stats.coursesViewed > 0 
                  ? formatMinutes(Math.round(stats.totalMinutesLearned / stats.coursesViewed))
                  : '0m'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-navy-400">Completion rate</span>
              <span className="text-white font-medium">
                {stats.coursesViewed > 0 
                  ? `${Math.round((stats.lessonsCompleted / stats.coursesViewed) * 100)}%`
                  : '0%'}
              </span>
            </div>
            {stats.favoriteCategory && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-400">Favorite category</span>
                <span className="text-primary-400 font-medium">
                  {stats.favoriteCategory}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Encouragement message */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20">
        <p className="text-sm text-navy-300">
          {stats.coursesViewed === 1 && "🌱 You've started your learning journey! Every expert was once a beginner."}
          {stats.coursesViewed > 1 && stats.coursesViewed < 5 && "📈 You're making progress! Keep exploring new courses."}
          {stats.coursesViewed >= 5 && stats.coursesViewed < 10 && "🌟 Impressive dedication! You're becoming a power learner."}
          {stats.coursesViewed >= 10 && "🚀 You're a learning champion! Your commitment is inspiring."}
        </p>
      </div>
    </div>
  )
}