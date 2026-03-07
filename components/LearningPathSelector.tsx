'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface LearningPathSelectorProps {
  coursesByDifficulty: {
    beginner: Course[]
    intermediate: Course[]
    advanced: Course[]
  }
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | null

const skillLevels = [
  {
    id: 'beginner' as const,
    title: 'Beginner',
    emoji: '🌱',
    description: 'Just getting started',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    glowColor: 'shadow-green-500/20',
  },
  {
    id: 'intermediate' as const,
    title: 'Intermediate',
    emoji: '🚀',
    description: 'Building on fundamentals',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/20',
  },
  {
    id: 'advanced' as const,
    title: 'Advanced',
    emoji: '⚡',
    description: 'Ready for deep dives',
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    glowColor: 'shadow-red-500/20',
  },
]

export default function LearningPathSelector({ coursesByDifficulty }: LearningPathSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelect = (level: SkillLevel) => {
    if (level === selectedLevel) {
      setSelectedLevel(null)
      return
    }
    setIsAnimating(true)
    setSelectedLevel(level)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const selectedCourses = selectedLevel ? coursesByDifficulty[selectedLevel].slice(0, 3) : []
  const selectedConfig = skillLevels.find(l => l.id === selectedLevel)

  return (
    <div className="space-y-8">
      {/* Skill Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillLevels.map((level) => {
          const isSelected = selectedLevel === level.id
          const courseCount = coursesByDifficulty[level.id].length
          
          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              className={`
                relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? `${level.borderColor} ${level.bgColor} shadow-xl ${level.glowColor}` 
                  : 'border-navy-700 bg-navy-800/50 hover:border-navy-600 hover:bg-navy-800'
                }
              `}
            >
              {/* Animated background gradient on hover */}
              <div 
                className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-br ${level.color}
                `}
                style={{ opacity: isSelected ? 0.1 : 0 }}
              />
              
              <div className="relative">
                {/* Emoji with bounce animation */}
                <div 
                  className={`
                    text-4xl mb-3 transition-transform duration-300
                    ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                  `}
                >
                  {level.emoji}
                </div>
                
                <h3 className={`text-xl font-bold mb-1 transition-colors duration-300 ${isSelected ? level.textColor : 'text-white'}`}>
                  {level.title}
                </h3>
                <p className="text-navy-400 text-sm mb-3">{level.description}</p>
                
                {/* Course count badge */}
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                  ${isSelected ? `${level.bgColor} ${level.textColor}` : 'bg-navy-700 text-navy-300'}
                `}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                </div>
              </div>
              
              {/* Selection indicator */}
              <div 
                className={`
                  absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300
                  ${isSelected 
                    ? `${level.borderColor} ${level.bgColor}` 
                    : 'border-navy-600'
                  }
                `}
              >
                {isSelected && (
                  <svg className={`w-3 h-3 ${level.textColor}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Recommended Courses Section */}
      <div 
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${selectedLevel ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        {selectedLevel && selectedConfig && (
          <div className={`
            p-6 rounded-2xl border-2 ${selectedConfig.borderColor} ${selectedConfig.bgColor}
            transition-all duration-300 ${isAnimating ? 'scale-[0.98] opacity-80' : 'scale-100 opacity-100'}
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedConfig.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Recommended {selectedConfig.title} Courses
                  </h3>
                  <p className="text-navy-400 text-sm">
                    Curated for your skill level
                  </p>
                </div>
              </div>
              <Link 
                href={`/courses?difficulty=${selectedLevel}`}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                  bg-gradient-to-r ${selectedConfig.color} text-white
                  hover:shadow-lg ${selectedConfig.glowColor} hover:scale-105
                `}
              >
                View All →
              </Link>
            </div>

            {selectedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className={`
                      group bg-navy-900/50 rounded-xl p-4 border border-navy-700 
                      hover:border-navy-600 transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {course.metadata?.thumbnail && (
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.metadata?.is_free && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded">
                            FREE
                          </span>
                        )}
                      </div>
                    )}
                    <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                      {course.metadata?.title || course.title}
                    </h4>
                    <p className="text-navy-400 text-sm line-clamp-1">
                      {course.metadata?.tagline || 'Start learning today'}
                    </p>
                    {course.metadata?.estimated_hours && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-navy-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.metadata.estimated_hours}h
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-navy-400">
                <p>No courses available at this level yet.</p>
                <Link href="/courses" className="text-primary-400 hover:text-primary-300 mt-2 inline-block">
                  Browse all courses →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtle hint when nothing selected */}
      {!selectedLevel && (
        <p className="text-center text-navy-500 text-sm animate-pulse">
          👆 Select your skill level to get personalized recommendations
        </p>
      )}
    </div>
  )
}