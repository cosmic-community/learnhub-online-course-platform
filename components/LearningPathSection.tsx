'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathSectionProps {
  courses: Course[]
  categories: Category[]
}

export default function LearningPathSection({ courses, categories }: LearningPathSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  // Group courses by difficulty
  const coursesByDifficulty = {
    beginner: courses.filter(c => c.metadata?.difficulty?.value?.toLowerCase() === 'beginner'),
    intermediate: courses.filter(c => c.metadata?.difficulty?.value?.toLowerCase() === 'intermediate'),
    advanced: courses.filter(c => c.metadata?.difficulty?.value?.toLowerCase() === 'advanced'),
  }

  const levels = [
    { key: 'beginner' as const, label: 'Beginner', emoji: '🌱', color: 'from-green-500 to-emerald-500', description: 'Start your journey here' },
    { key: 'intermediate' as const, label: 'Intermediate', emoji: '🌿', color: 'from-yellow-500 to-amber-500', description: 'Level up your skills' },
    { key: 'advanced' as const, label: 'Advanced', emoji: '🌳', color: 'from-red-500 to-rose-500', description: 'Master your craft' },
  ]

  const selectedCourses = coursesByDifficulty[selectedLevel].slice(0, 4)

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-transparent border border-primary-500/20 text-primary-400 text-sm mb-4">
            <span className="animate-pulse">✨</span>
            <span>New Feature</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Learning Path</span>
          </h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Select your current skill level and discover courses tailored just for you. 
            Watch your skills grow from beginner to expert!
          </p>
        </div>

        {/* Skill Level Selector - Visual Path */}
        <div className="relative mb-16">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-800 -translate-y-1/2 hidden md:block">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ 
                width: selectedLevel === 'beginner' ? '16.66%' : selectedLevel === 'intermediate' ? '50%' : '83.33%' 
              }}
            />
          </div>

          {/* Level Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 relative">
            {levels.map((level, index) => (
              <button
                key={level.key}
                onClick={() => setSelectedLevel(level.key)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 transform
                  ${selectedLevel === level.key 
                    ? 'border-primary-500 bg-primary-500/10 scale-105 shadow-xl shadow-primary-500/20' 
                    : 'border-navy-700 bg-navy-900/50 hover:border-navy-600 hover:scale-102'
                  }
                `}
              >
                {/* Pulse effect when selected */}
                {selectedLevel === level.key && (
                  <div className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-pulse-slow" />
                )}
                
                <div className="relative">
                  {/* Step Number */}
                  <div className={`
                    absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full 
                    flex items-center justify-center text-sm font-bold
                    ${selectedLevel === level.key 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-navy-700 text-navy-400'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Emoji */}
                  <div className={`
                    text-5xl mb-4 transition-transform duration-300
                    ${selectedLevel === level.key ? 'scale-110 animate-bounce-slow' : ''}
                  `}>
                    {level.emoji}
                  </div>

                  {/* Label */}
                  <h3 className={`
                    text-xl font-bold mb-2 transition-colors
                    ${selectedLevel === level.key ? 'text-white' : 'text-navy-300'}
                  `}>
                    {level.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-navy-400">
                    {level.description}
                  </p>

                  {/* Course count badge */}
                  <div className={`
                    mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                    ${selectedLevel === level.key 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'bg-navy-800 text-navy-400'
                    }
                  `}>
                    <span className="font-semibold">{coursesByDifficulty[level.key].length}</span>
                    <span>courses</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards for Selected Level */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{levels.find(l => l.key === selectedLevel)?.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {levels.find(l => l.key === selectedLevel)?.label} Courses
                </h3>
                <p className="text-sm text-navy-400">
                  {selectedCourses.length} courses available
                </p>
              </div>
            </div>
            <Link 
              href={`/courses?difficulty=${selectedLevel}`}
              className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 group"
            >
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {selectedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className={`
                    relative p-4 rounded-xl bg-navy-900/50 border border-navy-800 
                    hover:border-primary-500/50 transition-all duration-300 
                    hover:shadow-lg hover:shadow-primary-500/10
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredCourse(course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    {course.metadata?.thumbnail ? (
                      <img
                        src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                        alt={course.title}
                        className={`
                          w-full h-full object-cover transition-transform duration-500
                          ${hoveredCourse === course.id ? 'scale-110' : ''}
                        `}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                        <span className="text-3xl">📚</span>
                      </div>
                    )}
                    
                    {/* Progress indicator (decorative) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-1000"
                        style={{ width: hoveredCourse === course.id ? '30%' : '0%' }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 text-xs text-navy-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {course.metadata?.lessons?.length || 0} lessons
                    </span>
                    {course.metadata?.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.metadata.estimated_hours}h
                      </span>
                    )}
                  </div>

                  {/* Hover indicator */}
                  <div className={`
                    absolute top-2 right-2 w-8 h-8 rounded-full bg-primary-500/20 
                    flex items-center justify-center transition-all duration-300
                    ${hoveredCourse === course.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  `}>
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-navy-900/30 rounded-2xl border border-navy-800">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-navy-400">No courses at this level yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Motivational message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-navy-900/50 to-navy-800/50 border border-navy-700">
            <span className="text-2xl">💡</span>
            <p className="text-navy-300 text-sm">
              <span className="text-white font-medium">Pro tip:</span> Start with beginner courses to build a strong foundation, then progress naturally!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}