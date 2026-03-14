'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category, Course } from '@/types'

interface LearningPathPreviewProps {
  categories: Category[]
  courses: Course[]
}

export default function LearningPathPreview({ categories, courses }: LearningPathPreviewProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id || null
  )

  const getCoursesForCategory = (categoryId: string) => {
    return courses.filter(course => {
      const courseCategories = course.metadata?.categories
      if (!courseCategories) return false
      if (Array.isArray(courseCategories)) {
        return courseCategories.some(cat => cat.id === categoryId)
      }
      return false
    }).slice(0, 3)
  }

  const activeCategyData = categories.find(c => c.id === activeCategory)
  const activeCourses = activeCategory ? getCoursesForCategory(activeCategory) : []

  if (categories.length === 0) return null

  return (
    <section className="py-20 bg-navy-900/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
            <span>🗺️</span> Learning Paths
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Choose Your Learning Journey
          </h2>
          <p className="text-navy-400 max-w-lg mx-auto">
            Select a path and explore the courses that will take you from beginner to expert
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all duration-300
                    flex items-center gap-4 group
                    ${activeCategory === category.id
                      ? 'bg-primary-500/20 border-2 border-primary-500/50'
                      : 'bg-navy-800/50 border-2 border-transparent hover:border-navy-600'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`
                    text-3xl transition-transform duration-300
                    ${activeCategory === category.id ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {category.metadata?.icon || '📂'}
                  </span>
                  <div>
                    <h3 className={`
                      font-semibold transition-colors
                      ${activeCategory === category.id ? 'text-primary-400' : 'text-white'}
                    `}>
                      {category.metadata?.name || category.title}
                    </h3>
                    <p className="text-sm text-navy-400 line-clamp-1">
                      {category.metadata?.description || 'Explore this category'}
                    </p>
                  </div>
                  {activeCategory === category.id && (
                    <div className="ml-auto">
                      <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Path Visualization */}
          <div className="lg:col-span-2">
            {activeCategyData && (
              <div className="bg-navy-800/30 backdrop-blur-sm border border-navy-700 rounded-2xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">{activeCategyData.metadata?.icon || '📂'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {activeCategyData.metadata?.name || activeCategyData.title} Path
                    </h3>
                    <p className="text-sm text-navy-400">
                      {activeCourses.length} courses in this path
                    </p>
                  </div>
                </div>

                {/* Course Journey */}
                {activeCourses.length > 0 ? (
                  <div className="space-y-4">
                    {activeCourses.map((course, index) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.slug}`}
                        className="flex items-center gap-4 p-4 bg-navy-900/50 rounded-xl hover:bg-navy-900 transition-colors group"
                      >
                        {/* Step indicator */}
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <span className="text-primary-400 font-bold">{index + 1}</span>
                        </div>
                        
                        {/* Course info */}
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                            {course.metadata?.title || course.title}
                          </h4>
                          <p className="text-sm text-navy-400 truncate">
                            {course.metadata?.tagline || 'Learn more about this topic'}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <svg 
                          className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                    
                    {/* View all link */}
                    <Link
                      href={`/categories/${activeCategyData.slug}`}
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-navy-700 rounded-xl text-navy-400 hover:border-primary-500/50 hover:text-primary-400 transition-colors"
                    >
                      <span>View complete path</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔜</div>
                    <p className="text-navy-400">
                      Courses coming soon for this path!
                    </p>
                    <Link href="/courses" className="btn-secondary mt-4 inline-flex text-sm">
                      Browse All Courses
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}