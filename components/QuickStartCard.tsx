'use client'

import Link from 'next/link'
import type { Course } from '@/types'
import { useState, useEffect } from 'react'

interface QuickStartCardProps {
  courses: Course[]
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const getRecommendedCourse = () => {
    const filtered = courses.filter(c => {
      const difficulty = c.metadata?.difficulty
      if (typeof difficulty === 'string') {
        return difficulty.toLowerCase() === selectedLevel
      }
      if (difficulty && typeof difficulty === 'object' && 'value' in difficulty) {
        return String(difficulty.value).toLowerCase() === selectedLevel
      }
      return false
    })
    return filtered[0] ?? courses[0]
  }

  const recommendedCourse = getRecommendedCourse()

  const levels = [
    { key: 'beginner' as const, label: 'Beginner', emoji: '🌱', description: "I'm just starting out" },
    { key: 'intermediate' as const, label: 'Intermediate', emoji: '🌿', description: 'I have some experience' },
    { key: 'advanced' as const, label: 'Advanced', emoji: '🌳', description: "I'm looking to master" },
  ]

  if (!recommendedCourse) return null

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🚀</span>
          <h3 className="text-xl font-bold text-white">Quick Start</h3>
          <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
            Personalized
          </span>
        </div>

        <p className="text-navy-300 mb-6">What&apos;s your experience level?</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {levels.map((level) => (
            <button
              key={level.key}
              onClick={() => setSelectedLevel(level.key)}
              className={`p-4 rounded-xl text-center transition-all duration-300 ${
                selectedLevel === level.key
                  ? 'bg-primary-500/20 border-2 border-primary-500 scale-105'
                  : 'bg-navy-800/50 border-2 border-transparent hover:border-navy-600'
              }`}
            >
              <div className="text-2xl mb-2">{level.emoji}</div>
              <div className="text-sm font-medium text-white">{level.label}</div>
            </button>
          ))}
        </div>

        <div className="bg-navy-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-primary-400 font-medium">Recommended for you:</span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">
            {recommendedCourse.metadata?.title ?? recommendedCourse.title}
          </h4>
          <p className="text-navy-400 text-sm line-clamp-2">
            {recommendedCourse.metadata?.tagline ?? 'Start your learning journey with this course'}
          </p>
        </div>

        <Link
          href={`/courses/${recommendedCourse.slug}`}
          className="btn-primary w-full justify-center"
        >
          Start Learning
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}