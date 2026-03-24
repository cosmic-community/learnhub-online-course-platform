'use client'

import { useEffect, useState } from 'react'
import LearningProgressRing from './LearningProgressRing'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

export default function LearningStats({
  totalCourses,
  totalLessons,
  totalInstructors,
  totalCategories
}: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      value: totalCourses,
      max: Math.max(totalCourses, 15),
      label: 'Courses Available',
      color: '#6366f1' // primary
    },
    {
      value: totalLessons,
      max: Math.max(totalLessons, 50),
      label: 'Video Lessons',
      color: '#22c55e' // green
    },
    {
      value: totalInstructors,
      max: Math.max(totalInstructors, 10),
      label: 'Expert Instructors',
      color: '#f59e0b' // amber
    },
    {
      value: totalCategories,
      max: Math.max(totalCategories, 8),
      label: 'Categories',
      color: '#ec4899' // pink
    }
  ]

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="card p-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">
            📊 Learning Platform Stats
          </h3>
          <p className="text-navy-400 text-sm">
            Your gateway to knowledge
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <LearningProgressRing
                value={stat.value}
                max={stat.max}
                label={stat.label}
                color={stat.color}
              />
            </div>
          ))}
        </div>
        
        {/* Fun fact */}
        <div className="mt-8 pt-6 border-t border-navy-800">
          <div className="flex items-center justify-center gap-2 text-sm text-navy-400">
            <span className="text-lg">✨</span>
            <span>
              {totalLessons > 0 
                ? `That's over ${Math.round(totalLessons * 30 / 60)} hours of learning content!`
                : 'Start your learning journey today!'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}