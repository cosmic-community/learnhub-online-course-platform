'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface SmartRecommendationsProps {
  courses: Course[]
  currentCourseId?: string
}

const VIEWED_KEY = 'learnhub-viewed-courses'

export default function SmartRecommendations({ courses, currentCourseId }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Track current course view
    if (currentCourseId) {
      const viewed = getViewedCourses()
      if (!viewed.includes(currentCourseId)) {
        viewed.push(currentCourseId)
        localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed.slice(-10))) // Keep last 10
      }
    }
    
    // Generate recommendations
    const recs = generateRecommendations(courses, currentCourseId)
    setRecommendations(recs)
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
  }, [courses, currentCourseId])
  
  if (recommendations.length === 0) return null
  
  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="bg-gradient-to-r from-navy-900/80 to-navy-800/80 backdrop-blur-sm rounded-2xl border border-navy-700/50 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
            <p className="text-sm text-navy-400">Based on your learning journey</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((course, index) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex items-center gap-3 p-3 bg-navy-800/50 rounded-xl border border-navy-700/50 hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              {course.metadata?.thumbnail?.imgix_url ? (
                <img
                  src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                  {course.metadata?.title || course.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {course.metadata?.difficulty?.value && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      course.metadata.difficulty.value === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      course.metadata.difficulty.value === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {course.metadata.difficulty.value}
                    </span>
                  )}
                  {course.metadata?.is_free && (
                    <span className="text-xs text-primary-400">Free</span>
                  )}
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function getViewedCourses(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(VIEWED_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function generateRecommendations(courses: Course[], currentCourseId?: string): Course[] {
  const viewed = getViewedCourses()
  
  // Get current course details for matching
  const currentCourse = currentCourseId 
    ? courses.find(c => c.id === currentCourseId)
    : null
  
  // Filter out already viewed and current course
  let candidates = courses.filter(c => 
    !viewed.includes(c.id) && c.id !== currentCourseId
  )
  
  // If we have a current course, prioritize by matching categories
  if (currentCourse?.metadata?.categories && Array.isArray(currentCourse.metadata.categories)) {
    const currentCategoryIds = currentCourse.metadata.categories.map((cat: { id: string }) => cat.id)
    
    candidates.sort((a, b) => {
      const aCategories = a.metadata?.categories || []
      const bCategories = b.metadata?.categories || []
      
      const aMatch = Array.isArray(aCategories) 
        ? aCategories.filter((cat: { id: string }) => currentCategoryIds.includes(cat.id)).length 
        : 0
      const bMatch = Array.isArray(bCategories) 
        ? bCategories.filter((cat: { id: string }) => currentCategoryIds.includes(cat.id)).length 
        : 0
      
      return bMatch - aMatch
    })
  }
  
  // If not enough candidates, add some viewed courses back
  if (candidates.length < 3) {
    const additional = courses.filter(c => 
      c.id !== currentCourseId && !candidates.find(cc => cc.id === c.id)
    )
    candidates = [...candidates, ...additional]
  }
  
  // Return top 3
  return candidates.slice(0, 3)
}