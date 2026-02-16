'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

interface UserStats {
  lessonsViewed: number
  coursesStarted: string[]
  totalTimeSpent: number
  lastActivity: string
}

const defaultStats: UserStats = {
  lessonsViewed: 0,
  coursesStarted: [],
  totalTimeSpent: 0,
  lastActivity: '',
}

export default function QuickStats({ totalCourses, totalLessons, totalHours }: QuickStatsProps) {
  const [userStats, setUserStats] = useState<UserStats>(defaultStats)
  const [animatedValues, setAnimatedValues] = useState({ lessons: 0, courses: 0, hours: 0 })

  useEffect(() => {
    // Load user stats from localStorage
    const stored = localStorage.getItem('learnhub-user-stats')
    if (stored) {
      setUserStats(JSON.parse(stored))
    }

    // Animate numbers
    const duration = 1500
    const steps = 60
    const interval = duration / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
      
      setAnimatedValues({
        lessons: Math.round(totalLessons * easeOut),
        courses: Math.round(totalCourses * easeOut),
        hours: Math.round(totalHours * easeOut),
      })
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [totalCourses, totalLessons, totalHours])

  const statsItems = [
    {
      icon: '📚',
      label: 'Total Courses',
      value: animatedValues.courses,
      suffix: '+',
      color: 'from-primary-500/20 to-primary-600/10',
      borderColor: 'border-primary-500/30',
    },
    {
      icon: '📖',
      label: 'Total Lessons',
      value: animatedValues.lessons,
      suffix: '+',
      color: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: '⏱️',
      label: 'Hours of Content',
      value: animatedValues.hours,
      suffix: '+',
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: '🎯',
      label: 'Your Progress',
      value: userStats.lessonsViewed,
      suffix: ' lessons',
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
      isPersonal: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsItems.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Decorative glow */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
          
          <div className="relative">
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-sm text-navy-400">
              {stat.label}
              {stat.isPersonal && (
                <span className="ml-1 text-xs text-primary-400">(you)</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}