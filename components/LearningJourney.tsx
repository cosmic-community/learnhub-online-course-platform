'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningJourneyProps {
  courses: Course[]
  categories: Category[]
}

export default function LearningJourney({ courses, categories }: LearningJourneyProps) {
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const levels = [
    { id: 'all', label: 'All Levels', icon: '🌟' },
    { id: 'beginner', label: 'Beginner', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', icon: '🌿' },
    { id: 'advanced', label: 'Advanced', icon: '🌳' },
  ] as const

  const filteredCourses = useMemo(() => {
    if (selectedLevel === 'all') return courses.slice(0, 6)
    return courses
      .filter(course => course.metadata?.difficulty?.value?.toLowerCase() === selectedLevel)
      .slice(0, 6)
  }, [courses, selectedLevel])

  const journeyPath = [
    { step: 1, title: 'Choose Your Path', description: 'Select a category that interests you', icon: '🎯' },
    { step: 2, title: 'Start Learning', description: 'Begin with beginner-friendly courses', icon: '📚' },
    { step: 3, title: 'Practice & Build', description: 'Apply your skills with projects', icon: '🛠️' },
    { step: 4, title: 'Level Up', description: 'Progress to advanced topics', icon: '🚀' },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-full px-4 py-2 mb-4">
            <span className="text-lg">✨</span>
            <span className="text-primary-400 text-sm font-medium">Personalized For You</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Follow a structured path to mastery. From fundamentals to advanced techniques, 
            we've got courses for every stage of your journey.
          </p>
        </div>

        {/* Journey Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {journeyPath.map((item, index) => (
            <div 
              key={item.step}
              className="relative group"
            >
              <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-6 text-center transition-all duration-300 group-hover:border-primary-500/50 group-hover:bg-navy-900/80">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs text-primary-400 font-semibold mb-1">Step {item.step}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-navy-400 text-sm">{item.description}</p>
              </div>
              {/* Connector arrow */}
              {index < journeyPath.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-navy-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedLevel === level.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <span>{level.icon}</span>
              <span>{level.label}</span>
            </button>
          ))}
        </div>

        {/* Course Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group relative"
              onMouseEnter={() => setHoveredCard(course.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-navy-900/50 border rounded-xl overflow-hidden transition-all duration-500 ${
                hoveredCard === course.id 
                  ? 'border-primary-500 shadow-xl shadow-primary-500/10 scale-[1.02]' 
                  : 'border-navy-800'
              }`}>
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  {course.metadata?.thumbnail ? (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                  
                  {/* Difficulty badge */}
                  {course.metadata?.difficulty && (
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        course.metadata.difficulty.value === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                        course.metadata.difficulty.value === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {course.metadata.difficulty.value}
                      </span>
                    </div>
                  )}

                  {/* Price/Free badge */}
                  <div className="absolute top-3 right-3">
                    {course.metadata?.is_free ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                        Free
                      </span>
                    ) : (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-navy-900/90 text-white">
                        ${course.metadata?.price || 0}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  {course.metadata?.tagline && (
                    <p className="text-navy-400 text-sm mb-3 line-clamp-2">
                      {course.metadata.tagline}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-navy-500">
                    {course.metadata?.lessons && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {course.metadata.lessons.length} lessons
                      </span>
                    )}
                    {course.metadata?.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.metadata.estimated_hours}h
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover indicator */}
                <div className={`h-1 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ${
                  hoveredCard === course.id ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors group"
          >
            <span>View all {courses.length} courses</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}