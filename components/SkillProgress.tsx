'use client'

import { useState, useEffect } from 'react'

interface SkillCategory {
  name: string
  icon: string
  color: string
  courses: number
}

interface SkillProgressProps {
  categories: Array<{
    id: string
    slug: string
    title: string
    metadata?: {
      name?: string
      icon?: string
    }
  }>
  totalCourses: number
}

const SKILL_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500', 
  'from-orange-500 to-yellow-500',
  'from-green-500 to-emerald-500',
  'from-red-500 to-rose-500',
]

export default function SkillProgress({ categories, totalCourses }: SkillProgressProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Map categories to skill data
  const skills: SkillCategory[] = categories.slice(0, 5).map((cat, index) => ({
    name: cat.metadata?.name || cat.title,
    icon: cat.metadata?.icon || '📚',
    color: SKILL_COLORS[index % SKILL_COLORS.length],
    courses: Math.floor(totalCourses / categories.length) + (index < totalCourses % categories.length ? 1 : 0)
  }))

  const maxCourses = Math.max(...skills.map(s => s.courses), 1)

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
        <span className="text-sm text-navy-400">{totalCourses} courses available</span>
      </div>
      
      <div className="space-y-4">
        {skills.map((skill, index) => {
          const percentage = (skill.courses / maxCourses) * 100
          const isHovered = hoveredIndex === index
          
          return (
            <div 
              key={skill.name}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xl transition-transform duration-200 ${isHovered ? 'scale-125' : ''}`}>
                    {skill.icon}
                  </span>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isHovered ? 'text-white' : 'text-navy-300'
                  }`}>
                    {skill.name}
                  </span>
                </div>
                <span className="text-xs text-navy-500">
                  {skill.courses} course{skill.courses !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="relative h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: isAnimating ? `${percentage}%` : '0%',
                    transitionDelay: `${index * 150}ms`
                  }}
                />
                {/* Shimmer effect */}
                <div 
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ${
                    isAnimating ? 'translate-x-full' : '-translate-x-full'
                  }`}
                  style={{ 
                    width: '50%',
                    transitionDelay: `${index * 150 + 500}ms`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Fun fact */}
      <div className="mt-6 pt-4 border-t border-navy-800">
        <p className="text-xs text-navy-500 text-center">
          💡 Tip: Learners who explore multiple categories are 3x more likely to complete courses!
        </p>
      </div>
    </div>
  )
}