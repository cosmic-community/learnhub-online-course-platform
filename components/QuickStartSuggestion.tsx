'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSuggestionProps {
  courses: Course[]
}

function getGreeting(): { greeting: string; emoji: string; suggestion: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      emoji: '🌅',
      suggestion: 'Start your day with a quick lesson'
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      emoji: '☀️',
      suggestion: 'Perfect time for focused learning'
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening',
      emoji: '🌆',
      suggestion: 'Wind down with something new'
    }
  } else {
    return {
      greeting: 'Night owl mode',
      emoji: '🦉',
      suggestion: 'Late night learning session'
    }
  }
}

export default function QuickStartSuggestion({ courses }: QuickStartSuggestionProps) {
  const [timeInfo, setTimeInfo] = useState(getGreeting())
  const [suggestedCourse, setSuggestedCourse] = useState<Course | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setTimeInfo(getGreeting())
    
    // Pick a random course as suggestion
    if (courses.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(courses.length, 5))
      setSuggestedCourse(courses[randomIndex] ?? null)
    }
  }, [courses])

  if (!suggestedCourse) return null

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-primary-500/10 rounded-2xl transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-50'}`} />
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-primary-500/5 rounded-2xl animate-gradient-x`} />
      
      <div className="relative border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Greeting section */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-4xl transition-transform duration-500 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
                {timeInfo.emoji}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">{timeInfo.greeting}!</h3>
                <p className="text-navy-400 text-sm">{timeInfo.suggestion}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-navy-700" />
          
          {/* Suggested course */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
                Quick Start
              </span>
              <span className="flex items-center gap-1 text-xs text-navy-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recommended
              </span>
            </div>
            
            <Link 
              href={`/courses/${suggestedCourse.slug}`}
              className="group flex items-center gap-4"
            >
              {/* Thumbnail */}
              {suggestedCourse.metadata?.thumbnail && (
                <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                  <img
                    src={`${suggestedCourse.metadata.thumbnail.imgix_url}?w=160&h=112&fit=crop&auto=format,compress`}
                    alt={suggestedCourse.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors line-clamp-1">
                  {suggestedCourse.title}
                </h4>
                <p className="text-navy-400 text-sm line-clamp-1">
                  {suggestedCourse.metadata?.tagline}
                </p>
              </div>

              {/* Arrow */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-primary-500 translate-x-1' : ''}`}>
                <svg className={`w-5 h-5 transition-colors ${isHovered ? 'text-white' : 'text-navy-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}