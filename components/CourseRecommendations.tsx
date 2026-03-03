'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseRecommendationsProps {
  courses: Course[]
}

type LearnerLevel = 'new' | 'beginner' | 'intermediate' | 'advanced'

const levelConfig = {
  new: {
    label: '🌱 New Learner',
    description: 'Start with beginner-friendly courses',
    preferredDifficulty: ['beginner', 'Beginner'],
    color: 'from-green-500/20 to-emerald-500/20',
    textColor: 'text-green-400'
  },
  beginner: {
    label: '📚 Building Foundations',
    description: 'Ready to explore more topics',
    preferredDifficulty: ['beginner', 'Beginner', 'intermediate', 'Intermediate'],
    color: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-400'
  },
  intermediate: {
    label: '🚀 Growing Developer',
    description: 'Challenge yourself with advanced topics',
    preferredDifficulty: ['intermediate', 'Intermediate', 'advanced', 'Advanced'],
    color: 'from-purple-500/20 to-pink-500/20',
    textColor: 'text-purple-400'
  },
  advanced: {
    label: '⭐ Expert Path',
    description: 'Master advanced techniques',
    preferredDifficulty: ['advanced', 'Advanced'],
    color: 'from-orange-500/20 to-red-500/20',
    textColor: 'text-orange-400'
  }
}

function getDifficultyValue(difficulty: unknown): string {
  if (typeof difficulty === 'string') return difficulty
  if (difficulty && typeof difficulty === 'object' && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value)
  }
  return 'beginner'
}

export default function CourseRecommendations({ courses }: CourseRecommendationsProps) {
  const [level, setLevel] = useState<LearnerLevel>('new')
  const [recommendations, setRecommendations] = useState<Course[]>([])

  useEffect(() => {
    // Determine level based on visit history
    const stored = localStorage.getItem('learning-streak')
    if (stored) {
      const data = JSON.parse(stored) as { totalVisits: number }
      if (data.totalVisits >= 20) {
        setLevel('advanced')
      } else if (data.totalVisits >= 10) {
        setLevel('intermediate')
      } else if (data.totalVisits >= 3) {
        setLevel('beginner')
      }
    }
  }, [])

  useEffect(() => {
    const config = levelConfig[level]
    const filtered = courses.filter(course => {
      const difficulty = getDifficultyValue(course.metadata?.difficulty)
      return config.preferredDifficulty.some(d => 
        d.toLowerCase() === difficulty.toLowerCase()
      )
    })
    
    // Shuffle and take top 3
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setRecommendations(shuffled.slice(0, 3))
  }, [level, courses])

  const config = levelConfig[level]

  if (recommendations.length === 0) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`card p-8 bg-gradient-to-br ${config.color} border-none`}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
                <span className={`badge ${config.color} ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-navy-300">{config.description}</p>
            </div>
            
            {/* Level Selector */}
            <div className="flex gap-2">
              {(Object.keys(levelConfig) as LearnerLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    level === l
                      ? 'bg-primary-500 text-white'
                      : 'bg-navy-800/50 text-navy-300 hover:bg-navy-700/50'
                  }`}
                >
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group bg-navy-900/50 backdrop-blur-sm rounded-xl p-5 hover:bg-navy-900/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {course.metadata?.thumbnail && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                    {course.metadata?.title || course.title}
                  </h3>
                  {course.metadata?.is_free && (
                    <span className="badge badge-free text-xs">Free</span>
                  )}
                </div>
                
                <p className="text-sm text-navy-400 line-clamp-2 mb-3">
                  {course.metadata?.tagline}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-navy-500">
                  {course.metadata?.estimated_hours && (
                    <span>⏱️ {course.metadata.estimated_hours}h</span>
                  )}
                  <span className="capitalize">
                    📊 {getDifficultyValue(course.metadata?.difficulty)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}