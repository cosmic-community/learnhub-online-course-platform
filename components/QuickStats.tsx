'use client'

import { useState, useEffect } from 'react'

interface QuickStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
}

interface UserStats {
  completedLessons: number
  totalMinutes: number
  currentStreak: number
}

export default function QuickStats({ totalCourses, totalLessons, totalInstructors }: QuickStatsProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isHovering, setIsHovering] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('learnhub-streak')
    if (stored) {
      const data = JSON.parse(stored)
      setUserStats({
        completedLessons: data.totalLessonsCompleted || 0,
        totalMinutes: data.totalMinutesLearned || 0,
        currentStreak: data.currentStreak || 0,
      })
    }
  }, [])

  const stats = [
    {
      id: 'courses',
      value: totalCourses,
      label: 'Courses',
      icon: '📚',
      color: 'from-primary-500 to-teal-400',
      description: 'Expert-led courses available',
    },
    {
      id: 'lessons',
      value: totalLessons,
      label: 'Lessons',
      icon: '📖',
      color: 'from-purple-500 to-pink-400',
      description: 'In-depth video lessons',
    },
    {
      id: 'instructors',
      value: totalInstructors,
      label: 'Instructors',
      icon: '👨‍🏫',
      color: 'from-orange-500 to-amber-400',
      description: 'Industry professionals',
    },
    {
      id: 'progress',
      value: userStats?.completedLessons || 0,
      label: 'Completed',
      icon: '✅',
      color: 'from-green-500 to-emerald-400',
      description: 'Lessons you\'ve finished',
      isPersonal: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="relative group"
          onMouseEnter={() => setIsHovering(stat.id)}
          onMouseLeave={() => setIsHovering(null)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`card p-6 text-center transition-all duration-300 hover:scale-105 ${stat.isPersonal && !userStats ? 'opacity-50' : ''}`}>
            {/* Animated gradient background on hover */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
            />
            
            <div className="relative z-10">
              <span className="text-3xl mb-2 block transform transition-transform duration-300 group-hover:scale-125">
                {stat.icon}
              </span>
              <div className="text-3xl font-bold text-white mb-1 tabular-nums">
                <AnimatedNumber value={stat.value} />
                {!stat.isPersonal && <span className="text-primary-400">+</span>}
              </div>
              <div className="text-navy-400 text-sm">{stat.label}</div>
            </div>
            
            {/* Tooltip */}
            <div 
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 text-navy-200 text-xs rounded-lg whitespace-nowrap transition-all duration-200 ${
                isHovering === stat.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              {stat.description}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 20
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <>{displayValue}</>
}