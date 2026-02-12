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
  const [showResults, setShowResults] = useState(false)

  const levels = [
    { 
      key: 'beginner' as const, 
      label: 'Just Starting', 
      emoji: '🌱',
      description: 'New to programming'
    },
    { 
      key: 'intermediate' as const, 
      label: 'Some Experience', 
      emoji: '🌿',
      description: '1-2 years coding'
    },
    { 
      key: 'advanced' as const, 
      label: 'Experienced', 
      emoji: '🌳',
      description: '3+ years coding'
    },
  ]

  const recommendedCourses = selectedLevel
    ? courses
        .filter(course => {
          const difficulty = course.metadata?.difficulty?.value?.toLowerCase()
          return difficulty === selectedLevel
        })
        .slice(0, 3)
    : []

  function handleSelect(level: SkillLevel) {
    setSelectedLevel(level)
    setShowResults(true)
  }

  function handleReset() {
    setSelectedLevel(null)
    setShowResults(false)
  }

  return (
    <div className="relative">
      {!showResults ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            🎯 Not sure where to start?
          </h3>
          <p className="text-navy-400 mb-6">
            Tell us your experience level and we'll recommend the perfect courses for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {levels.map((level) => (
              <button
                key={level.key}
                onClick={() => handleSelect(level.key)}
                className="group relative px-6 py-4 bg-navy-800/50 border border-navy-700 rounded-xl hover:border-primary-500 hover:bg-navy-800 transition-all duration-300"
              >
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                  {level.emoji}
                </div>
                <div className="font-medium text-white">{level.label}</div>
                <div className="text-sm text-navy-400">{level.description}</div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-primary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {levels.find(l => l.key === selectedLevel)?.emoji} Recommended for you
              </h3>
              <p className="text-navy-400 text-sm">
                Perfect courses for {levels.find(l => l.key === selectedLevel)?.label.toLowerCase()} learners
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start over
            </button>
          </div>

          {recommendedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group relative bg-navy-800/50 border border-navy-700 rounded-xl p-4 hover:border-primary-500 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {course.metadata?.thumbnail && (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full aspect-video object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-sm text-navy-400 line-clamp-2 mt-1">
                    {course.metadata?.tagline}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-700">
                    <span className="text-xs text-navy-400">
                      {course.metadata?.lessons?.length || 0} lessons
                    </span>
                    {course.metadata?.is_free ? (
                      <span className="text-xs text-primary-400 font-medium">Free</span>
                    ) : (
                      <span className="text-xs text-navy-300">${course.metadata?.price || 0}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-navy-400">No courses found at this level yet.</p>
              <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block">
                Browse all courses →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}