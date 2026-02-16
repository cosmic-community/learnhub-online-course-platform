'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | null

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(null)

  const levels = [
    { 
      key: 'beginner' as const, 
      label: 'Beginner', 
      emoji: '🌱', 
      description: 'New to coding',
      color: 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400'
    },
    { 
      key: 'intermediate' as const, 
      label: 'Intermediate', 
      emoji: '🚀', 
      description: 'Some experience',
      color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:border-yellow-400'
    },
    { 
      key: 'advanced' as const, 
      label: 'Advanced', 
      emoji: '⚡', 
      description: 'Ready for challenges',
      color: 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400'
    },
  ]

  const filteredCourses = selectedLevel
    ? courses.filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase()
        return difficulty === selectedLevel
      })
    : []

  const recommendedCourse = filteredCourses[0]

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium mb-4">
            ✨ Quick Start
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            What's your experience level?
          </h2>
          <p className="text-navy-400 max-w-xl mx-auto">
            Select your skill level and we'll recommend the perfect course to start your journey
          </p>
        </div>

        {/* Level selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
          {levels.map((level) => (
            <button
              key={level.key}
              onClick={() => setSelectedLevel(selectedLevel === level.key ? null : level.key)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                bg-gradient-to-br ${level.color}
                ${selectedLevel === level.key 
                  ? 'scale-105 shadow-lg shadow-primary-500/20' 
                  : 'opacity-80 hover:opacity-100'
                }
              `}
            >
              <span className="text-4xl mb-3 block">{level.emoji}</span>
              <h3 className="text-lg font-semibold text-white mb-1">{level.label}</h3>
              <p className="text-sm text-navy-300">{level.description}</p>
              
              {selectedLevel === level.key && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Recommended course */}
        {selectedLevel && (
          <div className="animate-fadeIn">
            {recommendedCourse ? (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-4">
                  <span className="text-primary-400 text-sm font-medium">
                    🎯 Recommended for you
                  </span>
                </div>
                
                <Link 
                  href={`/courses/${recommendedCourse.slug}`}
                  className="block card p-6 hover:border-primary-500/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Thumbnail */}
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      {recommendedCourse.metadata?.thumbnail ? (
                        <img
                          src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=400&h=300&fit=crop&auto=format,compress`}
                          alt={recommendedCourse.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {recommendedCourse.title}
                      </h3>
                      {recommendedCourse.metadata?.tagline && (
                        <p className="text-navy-400 text-sm mb-4 line-clamp-2">
                          {recommendedCourse.metadata.tagline}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="badge badge-beginner">
                          {recommendedCourse.metadata?.difficulty?.value || 'Beginner'}
                        </span>
                        {recommendedCourse.metadata?.lessons && (
                          <span className="text-navy-400">
                            {recommendedCourse.metadata.lessons.length} lessons
                          </span>
                        )}
                        {recommendedCourse.metadata?.is_free && (
                          <span className="text-primary-400 font-medium">Free</span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                        <svg className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {filteredCourses.length > 1 && (
                  <p className="text-center mt-4 text-navy-400 text-sm">
                    +{filteredCourses.length - 1} more {selectedLevel} courses available
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-navy-400">
                  No {selectedLevel} courses available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}