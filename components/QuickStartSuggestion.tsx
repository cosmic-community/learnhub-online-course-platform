'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSuggestionProps {
  courses: Course[]
}

interface TimeOfDayContext {
  greeting: string
  emoji: string
  suggestion: string
  duration: string
}

function getTimeContext(): TimeOfDayContext {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      emoji: '🌅',
      suggestion: 'Start your day with a focused learning session',
      duration: '30 min'
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      emoji: '☀️',
      suggestion: 'Perfect time for a quick lesson between tasks',
      duration: '15 min'
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening',
      emoji: '🌆',
      suggestion: 'Wind down with some light learning',
      duration: '20 min'
    }
  } else {
    return {
      greeting: 'Night owl mode',
      emoji: '🌙',
      suggestion: 'Late night learning session? We respect that!',
      duration: '25 min'
    }
  }
}

export default function QuickStartSuggestion({ courses }: QuickStartSuggestionProps) {
  const [context, setContext] = useState<TimeOfDayContext | null>(null)
  const [suggestedCourse, setSuggestedCourse] = useState<Course | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setContext(getTimeContext())
    
    // Get a suggested course (rotate daily, prefer ones with lessons)
    if (courses.length > 0) {
      const today = new Date().getDate()
      const courseIndex = today % courses.length
      setSuggestedCourse(courses[courseIndex])
    }
  }, [courses])

  if (!context || !suggestedCourse) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-navy-700 rounded"></div>
      </div>
    )
  }

  const metadata = suggestedCourse.metadata
  const difficulty = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty

  return (
    <div 
      className="card p-6 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{context.emoji}</span>
              <h3 className="text-lg font-semibold text-white">{context.greeting}!</h3>
            </div>
            <p className="text-navy-400 text-sm">{context.suggestion}</p>
          </div>
          <div className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {context.duration}
          </div>
        </div>
        
        {/* Suggested Course */}
        <div className="bg-navy-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            {metadata?.thumbnail?.imgix_url ? (
              <img 
                src={`${metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                alt={metadata.title || suggestedCourse.title}
                className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📚</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm truncate">
                {metadata?.title || suggestedCourse.title}
              </h4>
              <p className="text-navy-400 text-xs line-clamp-1">
                {metadata?.tagline || 'Start your learning journey'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {difficulty && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    difficulty.toLowerCase() === 'beginner' ? 'badge-beginner' :
                    difficulty.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                    'badge-advanced'
                  }`}>
                    {difficulty}
                  </span>
                )}
                {metadata?.estimated_hours && (
                  <span className="text-navy-500 text-xs">
                    {metadata.estimated_hours}h total
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/courses/${suggestedCourse.slug}`}
            className="flex-1 btn-primary text-sm py-2 text-center"
          >
            Start Learning
          </Link>
          <Link 
            href="/courses"
            className="btn-secondary text-sm py-2 px-3"
            title="Browse all courses"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </Link>
        </div>
        
        {/* Shuffle indicator */}
        <p className="text-center text-navy-500 text-xs mt-3">
          ✨ Daily suggestion • Changes every day
        </p>
      </div>
    </div>
  )
}