'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [viewedCourses, setViewedCourses] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('learnhub-viewed-courses')
    if (stored) {
      setViewedCourses(JSON.parse(stored))
    }
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-8 w-16 bg-navy-700 rounded mb-2" />
            <div className="h-4 w-20 bg-navy-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const explorationProgress = Math.round((viewedCourses.length / totalCourses) * 100)
  
  const motivationalMessage = 
    explorationProgress === 0 ? "Start your journey! 🚀" :
    explorationProgress < 25 ? "Great start! Keep exploring 🌱" :
    explorationProgress < 50 ? "You're on fire! 🔥" :
    explorationProgress < 75 ? "Amazing progress! 💪" :
    explorationProgress < 100 ? "Almost there! 🎯" :
    "You've explored everything! 🏆"

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          emoji="📚"
          value={totalCourses}
          label="Total Courses"
          color="primary"
        />
        <StatCard
          emoji="📖"
          value={totalLessons}
          label="Total Lessons"
          color="purple"
        />
        <StatCard
          emoji="👨‍🏫"
          value={totalInstructors}
          label="Expert Instructors"
          color="green"
        />
        <StatCard
          emoji="👁️"
          value={viewedCourses.length}
          label="Courses Explored"
          color="yellow"
          highlight
        />
      </div>

      {/* Exploration Progress */}
      <div className="card p-4 bg-gradient-to-r from-navy-900/80 to-navy-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-navy-300">Course Exploration</span>
          <span className="text-sm font-medium text-primary-400">{explorationProgress}%</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${explorationProgress}%` }}
          />
        </div>
        <p className="text-xs text-navy-400">{motivationalMessage}</p>
      </div>
    </div>
  )
}

interface StatCardProps {
  emoji: string
  value: number
  label: string
  color: 'primary' | 'purple' | 'green' | 'yellow'
  highlight?: boolean
}

function StatCard({ emoji, value, label, color, highlight }: StatCardProps) {
  const colorClasses = {
    primary: 'from-primary-500/10 border-primary-500/20',
    purple: 'from-purple-500/10 border-purple-500/20',
    green: 'from-green-500/10 border-green-500/20',
    yellow: 'from-yellow-500/10 border-yellow-500/20',
  }

  return (
    <div className={`card p-4 bg-gradient-to-br ${colorClasses[color]} to-transparent ${highlight ? 'ring-1 ring-yellow-500/20' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-navy-400">{label}</div>
        </div>
      </div>
    </div>
  )
}