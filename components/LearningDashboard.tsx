'use client'

import { useEffect, useState } from 'react'

interface LearningDashboardProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  totalHours: number
}

function ProgressRing({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  color = 'primary'
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'green' | 'yellow' | 'purple'
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  const colorClasses = {
    primary: 'text-primary-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-navy-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClasses[color]} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-lg">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  )
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export default function LearningDashboard({
  coursesCount,
  instructorsCount,
  categoriesCount,
  lessonsCount,
  totalHours
}: LearningDashboardProps) {
  const stats = [
    { 
      label: 'Courses', 
      value: coursesCount, 
      icon: '📚', 
      color: 'primary' as const,
      description: 'Ready to explore'
    },
    { 
      label: 'Lessons', 
      value: lessonsCount, 
      icon: '📖', 
      color: 'green' as const,
      description: 'Video & text content'
    },
    { 
      label: 'Hours', 
      value: totalHours, 
      icon: '⏱️', 
      color: 'yellow' as const,
      suffix: '+',
      description: 'Of learning content'
    },
    { 
      label: 'Instructors', 
      value: instructorsCount, 
      icon: '👨‍🏫', 
      color: 'purple' as const,
      description: 'Industry experts'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-medium text-navy-300 mb-1">{stat.label}</div>
            <div className="text-xs text-navy-500">{stat.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}