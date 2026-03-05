'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartWidgetProps {
  beginnerCourses: Course[]
  intermediateCourses: Course[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export default function QuickStartWidget({ beginnerCourses, intermediateCourses }: QuickStartWidgetProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSelectLevel = (level: SkillLevel) => {
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedLevel(level)
      setIsAnimating(false)
    }, 300)
  }

  const recommendedCourses = selectedLevel === 'beginner' 
    ? beginnerCourses 
    : selectedLevel === 'intermediate' 
    ? intermediateCourses 
    : []

  const levelConfig = {
    beginner: {
      icon: '🌱',
      title: 'Just Starting Out',
      description: 'Perfect for those new to programming',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
    intermediate: {
      icon: '🚀',
      title: 'Some Experience',
      description: 'Ready to level up your skills',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    advanced: {
      icon: '⚡',
      title: 'Experienced Developer',
      description: 'Master advanced concepts',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
  }

  if (!selectedLevel) {
    return (
      <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Quick Start
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your experience level?</h2>
          <p className="text-navy-400">We&apos;ll recommend the perfect courses for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {(Object.keys(levelConfig) as SkillLevel[]).map((level) => {
            const config = levelConfig[level]
            return (
              <button
                key={level}
                onClick={() => handleSelectLevel(level)}
                className={`group relative p-6 rounded-2xl border ${config.borderColor} ${config.bgColor} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-${level === 'beginner' ? 'green' : level === 'intermediate' ? 'blue' : 'purple'}-500/10 text-left`}
              >
                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {config.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{config.title}</h3>
                <p className="text-sm text-navy-400">{config.description}</p>
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const config = levelConfig[selectedLevel]

  return (
    <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center text-2xl`}>
            {config.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Recommended for You</h2>
            <p className="text-sm text-navy-400">Based on your {selectedLevel} level</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsAnimating(true)
            setTimeout(() => {
              setSelectedLevel(null)
              setIsAnimating(false)
            }, 300)
          }}
          className="text-sm text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Change Level
        </button>
      </div>

      {recommendedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedCourses.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group card p-6 hover:border-primary-500/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                {course.metadata?.thumbnail?.imgix_url ? (
                  <img
                    src={`${course.metadata.thumbnail.imgix_url}?w=200&h=150&fit=crop&auto=format,compress`}
                    alt={course.metadata?.title || course.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center text-3xl flex-shrink-0">
                    📚
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${config.bgColor} ${config.textColor}`}>
                    {config.icon} {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                    {course.metadata?.title || course.title}
                  </h3>
                  <p className="text-sm text-navy-400 line-clamp-2 mt-1">
                    {course.metadata?.tagline || 'Start learning today'}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-navy-500">
                    {course.metadata?.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.metadata.estimated_hours}h
                      </span>
                    )}
                    {course.metadata?.lessons && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {course.metadata.lessons.length} lessons
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-navy-400">No courses found for this level yet.</p>
          <Link href="/courses" className="btn-primary mt-4">
            Browse All Courses
          </Link>
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/courses" className="text-primary-400 hover:text-primary-300 text-sm font-medium inline-flex items-center gap-1 transition-colors">
          View all {selectedLevel} courses
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}