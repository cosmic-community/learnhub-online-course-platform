'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartRecommendationProps {
  courses: Course[]
}

export default function QuickStartRecommendation({ courses }: QuickStartRecommendationProps) {
  const [selectedLevel, setSelectedLevel] = useState<'absolute' | 'some' | 'experienced' | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user has already selected a level
    const stored = localStorage.getItem('learning-level')
    if (stored) {
      setSelectedLevel(stored as 'absolute' | 'some' | 'experienced')
      setIsExpanded(false)
      setHasInteracted(true)
    }
  }, [])

  const handleSelectLevel = (level: 'absolute' | 'some' | 'experienced') => {
    setSelectedLevel(level)
    setHasInteracted(true)
    localStorage.setItem('learning-level', level)
    
    // Smooth collapse after selection
    setTimeout(() => setIsExpanded(false), 500)
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'absolute':
        return {
          icon: '🌱',
          title: 'Complete Beginner',
          description: 'New to coding? Start here!',
          recommendation: 'We recommend starting with fundamentals',
          color: 'from-green-400 to-emerald-500'
        }
      case 'some':
        return {
          icon: '🌿',
          title: 'Some Experience',
          description: "You've dabbled in code before",
          recommendation: 'Try intermediate concepts',
          color: 'from-blue-400 to-indigo-500'
        }
      case 'experienced':
        return {
          icon: '🌳',
          title: 'Experienced',
          description: 'Looking to level up specific skills',
          recommendation: 'Jump into advanced topics',
          color: 'from-purple-400 to-violet-500'
        }
      default:
        return null
    }
  }

  const recommendedCourse = courses[0]
  const config = selectedLevel ? getLevelConfig(selectedLevel) : null

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 border-primary-500/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-wave">👋</span>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {hasInteracted ? 'Your Learning Path' : 'Quick Start Guide'}
                </h3>
                <p className="text-navy-400 text-sm">
                  {hasInteracted 
                    ? 'Personalized recommendation based on your level'
                    : 'Tell us about your experience level'
                  }
                </p>
              </div>
            </div>
            
            {hasInteracted && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-navy-400 hover:text-white transition-colors p-2"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Level Selection */}
          {isExpanded && (
            <div className={`space-y-4 ${hasInteracted ? 'animate-fade-in' : ''}`}>
              {!selectedLevel && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { key: 'absolute' as const, icon: '🌱', label: 'Complete Beginner', desc: 'New to coding' },
                    { key: 'some' as const, icon: '🌿', label: 'Some Experience', desc: 'Dabbled before' },
                    { key: 'experienced' as const, icon: '🌳', label: 'Experienced', desc: 'Level up skills' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSelectLevel(option.key)}
                      className="group p-4 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-300 text-left hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {option.icon}
                      </div>
                      <div className="font-semibold text-white mb-1">{option.label}</div>
                      <div className="text-navy-400 text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Level & Recommendation */}
              {selectedLevel && config && recommendedCourse && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-navy-800/50">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{config.title}</div>
                      <div className="text-navy-400 text-sm">{config.description}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLevel(null)
                        setHasInteracted(false)
                        localStorage.removeItem('learning-level')
                      }}
                      className="ml-auto text-navy-400 hover:text-white text-sm underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Recommended Course Card */}
                  <div className="relative p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-600/5 border border-primary-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary-400 text-sm font-medium">✨ Recommended for you</span>
                    </div>
                    
                    <div className="flex gap-4">
                      {recommendedCourse.metadata?.thumbnail?.imgix_url && (
                        <img
                          src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=200&h=150&fit=crop&auto=format,compress`}
                          alt={recommendedCourse.metadata?.title || recommendedCourse.title}
                          className="w-24 h-18 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">
                          {recommendedCourse.metadata?.title || recommendedCourse.title}
                        </h4>
                        <p className="text-navy-300 text-sm line-clamp-2 mb-3">
                          {recommendedCourse.metadata?.tagline || 'Start your learning journey'}
                        </p>
                        <Link
                          href={`/courses/${recommendedCourse.slug}`}
                          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium text-sm group"
                        >
                          Start Learning
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collapsed View */}
          {!isExpanded && selectedLevel && config && recommendedCourse && (
            <Link
              href={`/courses/${recommendedCourse.slug}`}
              className="flex items-center justify-between p-3 rounded-lg bg-navy-800/30 hover:bg-navy-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <div className="text-white font-medium">
                    Continue: {recommendedCourse.metadata?.title || recommendedCourse.title}
                  </div>
                  <div className="text-navy-400 text-sm">Based on your {config.title.toLowerCase()} level</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-navy-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}