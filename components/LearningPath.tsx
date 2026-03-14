'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathProps {
  courses: Course[]
}

export default function LearningPath({ courses }: LearningPathProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Create a suggested learning path based on difficulty
  const beginnerCourses = courses.filter(c => {
    const difficulty = c.metadata?.difficulty
    if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
      return (difficulty as { value: string }).value?.toLowerCase() === 'beginner'
    }
    return String(difficulty).toLowerCase() === 'beginner'
  })
  
  const intermediateCourses = courses.filter(c => {
    const difficulty = c.metadata?.difficulty
    if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
      return (difficulty as { value: string }).value?.toLowerCase() === 'intermediate'
    }
    return String(difficulty).toLowerCase() === 'intermediate'
  })
  
  const advancedCourses = courses.filter(c => {
    const difficulty = c.metadata?.difficulty
    if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
      return (difficulty as { value: string }).value?.toLowerCase() === 'advanced'
    }
    return String(difficulty).toLowerCase() === 'advanced'
  })

  const pathSteps = [
    { 
      level: 'Start Here', 
      courses: beginnerCourses.slice(0, 2),
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: '🌱'
    },
    { 
      level: 'Level Up', 
      courses: intermediateCourses.slice(0, 2),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      icon: '🚀'
    },
    { 
      level: 'Master', 
      courses: advancedCourses.slice(0, 2),
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: '👑'
    },
  ].filter(step => step.courses.length > 0)

  if (pathSteps.length === 0) return null

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 -translate-x-1/2 hidden md:block" />
      
      <div className="space-y-8 md:space-y-12">
        {pathSteps.map((step, stepIndex) => (
          <div 
            key={step.level}
            className={`relative ${stepIndex % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'}`}
          >
            {/* Step indicator */}
            <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10 hidden md:flex">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-lg shadow-black/20 ring-4 ring-navy-950`}>
                {step.icon}
              </div>
            </div>

            <div className={`${step.bgColor} ${step.borderColor} border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl md:hidden">{step.icon}</span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                    Step {stepIndex + 1}
                  </span>
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.level}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-3">
                {step.courses.map((course, courseIndex) => {
                  const globalIndex = stepIndex * 2 + courseIndex
                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group block"
                      onMouseEnter={() => setHoveredIndex(globalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className={`flex items-center gap-3 p-3 rounded-xl bg-navy-900/50 border border-navy-700 transition-all duration-300 ${
                        hoveredIndex === globalIndex ? 'border-primary-500/50 bg-navy-800/50 shadow-lg shadow-primary-500/10' : ''
                      }`}>
                        {course.metadata?.thumbnail?.imgix_url && (
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate group-hover:text-primary-400 transition-colors">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-xs text-navy-400 truncate">
                            {course.metadata?.tagline || 'Start learning'}
                          </p>
                        </div>
                        <span className={`text-lg transition-transform duration-300 ${
                          hoveredIndex === globalIndex ? 'translate-x-1' : ''
                        }`}>
                          →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion badge */}
      <div className="relative mt-8 md:mt-12 text-center">
        <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gradient-to-b from-pink-500 to-transparent -translate-x-1/2 hidden md:block" />
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500/20 to-pink-500/20 border border-primary-500/30 rounded-full">
          <span className="text-2xl">🏆</span>
          <span className="font-semibold text-white">Ready for any challenge!</span>
        </div>
      </div>
    </div>
  )
}