'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartRecommendationProps {
  courses: Course[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | null

export default function QuickStartRecommendation({ courses }: QuickStartRecommendationProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyValue = (course: Course): string => {
    const difficulty = course.metadata?.difficulty
    if (typeof difficulty === 'string') return difficulty.toLowerCase()
    if (difficulty && typeof difficulty === 'object' && 'value' in difficulty) {
      return String(difficulty.value).toLowerCase()
    }
    return 'beginner'
  }

  const filteredCourses = selectedLevel
    ? courses.filter(course => getDifficultyValue(course) === selectedLevel)
    : []

  const recommendedCourse = filteredCourses[0]

  const levels = [
    { 
      id: 'beginner' as SkillLevel, 
      label: 'Beginner', 
      emoji: '🌱', 
      description: 'Just starting out',
      color: 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400'
    },
    { 
      id: 'intermediate' as SkillLevel, 
      label: 'Intermediate', 
      emoji: '🌿', 
      description: 'Some experience',
      color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:border-yellow-400'
    },
    { 
      id: 'advanced' as SkillLevel, 
      label: 'Advanced', 
      emoji: '🌳', 
      description: 'Ready for challenges',
      color: 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400'
    },
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            <span>✨</span> Quick Start
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Not sure where to begin?
          </h2>
          <p className="text-navy-400 max-w-lg mx-auto">
            Tell us your experience level and we&apos;ll recommend the perfect course for you
          </p>
        </div>

        {/* Skill Level Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedLevel(level.id)
                setIsExpanded(true)
              }}
              className={`
                relative p-6 rounded-xl border transition-all duration-300 text-left group
                bg-gradient-to-br ${level.color}
                ${selectedLevel === level.id 
                  ? 'ring-2 ring-primary-500 scale-[1.02]' 
                  : 'hover:scale-[1.02]'
                }
              `}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {level.emoji}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{level.label}</h3>
              <p className="text-sm text-navy-400">{level.description}</p>
              
              {selectedLevel === level.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Recommendation Result */}
        {isExpanded && selectedLevel && (
          <div className="animate-fade-in-up">
            {recommendedCourse ? (
              <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-primary-400 text-sm font-medium mb-1">Perfect match for you</p>
                    <h3 className="text-xl font-bold text-white">{recommendedCourse.metadata?.title || recommendedCourse.title}</h3>
                  </div>
                </div>
                
                <p className="text-navy-300 mb-6 line-clamp-2">
                  {recommendedCourse.metadata?.tagline || 'Start your learning journey with this course'}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Link 
                    href={`/courses/${recommendedCourse.slug}`}
                    className="btn-primary"
                  >
                    Start Learning
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  
                  {filteredCourses.length > 1 && (
                    <Link 
                      href="/courses"
                      className="text-navy-400 hover:text-primary-400 text-sm transition-colors"
                    >
                      +{filteredCourses.length - 1} more {selectedLevel} courses →
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-navy-300">
                  No {selectedLevel} courses available yet. Check out our other courses!
                </p>
                <Link href="/courses" className="btn-secondary mt-4 inline-flex">
                  Browse All Courses
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}