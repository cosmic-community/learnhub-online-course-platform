'use client'

import { useEffect, useState } from 'react'

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
  totalHours: number
  freeCoursesCount: number
}

export default function LearningStats({
  coursesCount,
  instructorsCount,
  categoriesCount,
  lessonsCount,
  totalHours,
  freeCoursesCount
}: LearningStatsProps) {
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [animatedHours, setAnimatedHours] = useState(0)

  useEffect(() => {
    // Animate numbers on mount
    const duration = 1500
    const steps = 30
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedCourses(Math.floor(coursesCount * easeOut))
      setAnimatedLessons(Math.floor(lessonsCount * easeOut))
      setAnimatedHours(Math.floor(totalHours * easeOut))

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedCourses(coursesCount)
        setAnimatedLessons(lessonsCount)
        setAnimatedHours(totalHours)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, lessonsCount, totalHours])

  const stats = [
    { 
      value: animatedCourses, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      value: animatedLessons, 
      label: 'Lessons', 
      icon: '📖',
      suffix: '+',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      value: animatedHours, 
      label: 'Hours of Content', 
      icon: '⏱️',
      suffix: 'h+',
      color: 'from-green-400 to-green-600'
    },
    { 
      value: instructorsCount, 
      label: 'Expert Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-orange-400 to-orange-600'
    },
    { 
      value: freeCoursesCount, 
      label: 'Free Courses', 
      icon: '🎁',
      suffix: '',
      color: 'from-pink-400 to-pink-600'
    },
    { 
      value: categoriesCount, 
      label: 'Categories', 
      icon: '🏷️',
      suffix: '',
      color: 'from-cyan-400 to-cyan-600'
    },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-navy-700 transition-all hover:scale-105 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}{stat.suffix}
          </div>
          <div className="text-navy-400 text-xs mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}