'use client'

import { useState, useEffect } from 'react'

interface LearningPathProgressProps {
  totalHours: number
  totalCourses: number
  totalLessons: number
}

export default function LearningPathProgress({ 
  totalHours, 
  totalCourses, 
  totalLessons 
}: LearningPathProgressProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const milestones = [
    { hours: 10, label: 'Getting Started', icon: '🌱' },
    { hours: 50, label: 'Building Skills', icon: '📚' },
    { hours: 100, label: 'Intermediate', icon: '⚡' },
    { hours: 200, label: 'Advanced', icon: '🚀' },
    { hours: 500, label: 'Expert', icon: '👑' },
  ]

  // Determine which milestone the platform's content reaches
  const reachedMilestone = milestones.filter(m => totalHours >= m.hours).length

  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-navy-900/70 border border-navy-700 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 transition-transform duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Learning Path Available</h3>
          <span className="text-primary-400 text-sm font-medium">
            {totalHours}+ hours of content
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-navy-800 rounded-full mb-4 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(progress / 100) * Math.min((totalHours / 500) * 100, 100)}%` }}
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* Milestones */}
        <div className="flex justify-between items-center">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.hours}
              className={`flex flex-col items-center transition-all duration-300 ${
                index < reachedMilestone 
                  ? 'opacity-100' 
                  : 'opacity-40'
              }`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 transition-all duration-300 ${
                  index < reachedMilestone 
                    ? 'bg-primary-500/20 scale-110' 
                    : 'bg-navy-800'
                }`}
              >
                {milestone.icon}
              </div>
              <span className="text-xs text-navy-400 hidden sm:block">{milestone.label}</span>
              <span className="text-xs text-navy-500">{milestone.hours}h</span>
            </div>
          ))}
        </div>

        {/* Stats summary */}
        <div className="mt-6 pt-4 border-t border-navy-800 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{totalCourses}</div>
            <div className="text-xs text-navy-400">Courses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalLessons}</div>
            <div className="text-xs text-navy-400">Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-400">{totalHours}+</div>
            <div className="text-xs text-navy-400">Hours</div>
          </div>
        </div>
      </div>
    </div>
  )
}