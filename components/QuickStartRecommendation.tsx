'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartRecommendationProps {
  courses: Course[]
}

const getRecommendationReason = (): { type: string; emoji: string; reason: string } => {
  const hour = new Date().getHours()
  const day = new Date().getDay()
  
  // Weekend special
  if (day === 0 || day === 6) {
    return {
      type: 'weekend',
      emoji: '🎉',
      reason: "Weekend learning! Perfect time for a deeper dive"
    }
  }
  
  // Morning (quick energizing content)
  if (hour >= 5 && hour < 10) {
    return {
      type: 'morning',
      emoji: '⚡',
      reason: "Quick morning boost to start your day"
    }
  }
  
  // Lunch break
  if (hour >= 11 && hour < 14) {
    return {
      type: 'lunch',
      emoji: '🍽️',
      reason: "Perfect for your lunch break"
    }
  }
  
  // Afternoon focus
  if (hour >= 14 && hour < 18) {
    return {
      type: 'afternoon',
      emoji: '🎯',
      reason: "Peak focus time - tackle something challenging!"
    }
  }
  
  // Evening
  if (hour >= 18 && hour < 22) {
    return {
      type: 'evening',
      emoji: '🌟',
      reason: "Wind down with something interesting"
    }
  }
  
  // Night owl
  return {
    type: 'night',
    emoji: '🦉',
    reason: "Late night learning session"
  }
}

export default function QuickStartRecommendation({ courses }: QuickStartRecommendationProps) {
  const [recommendation, setRecommendation] = useState<Course | null>(null)
  const [reason, setReason] = useState(getRecommendationReason())
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Get a random course as recommendation
    if (courses.length > 0) {
      const randomIndex = Math.floor(Math.random() * courses.length)
      setRecommendation(courses[randomIndex])
    }
    setReason(getRecommendationReason())
  }, [courses])

  if (!recommendation) return null

  const thumbnail = recommendation.metadata?.thumbnail
  const lessons = recommendation.metadata?.lessons || []

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-primary-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div 
        className="relative card p-6 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className="relative flex flex-col lg:flex-row gap-6">
          {/* Left: Quick Start Label */}
          <div className="lg:w-1/3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl animate-bounce">{reason.emoji}</span>
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Quick Start
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">Ready to Learn?</h3>
            <p className="text-navy-400 text-sm">{reason.reason}</p>
            
            {/* Estimated time */}
            <div className="mt-4 flex items-center gap-2 text-sm text-navy-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                ~{recommendation.metadata?.estimated_hours || 1} hour{(recommendation.metadata?.estimated_hours || 1) > 1 ? 's' : ''} total
              </span>
            </div>
          </div>

          {/* Right: Course Preview */}
          <div className="lg:w-2/3 flex gap-4">
            {/* Thumbnail */}
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              {thumbnail ? (
                <img
                  src={`${thumbnail.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                  alt={recommendation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold mb-1 line-clamp-1">
                {recommendation.title}
              </h4>
              <p className="text-navy-400 text-sm mb-3 line-clamp-2">
                {recommendation.metadata?.tagline || 'Start learning today!'}
              </p>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-navy-500">
                  {lessons.length} lessons
                </span>
                
                <Link
                  href={`/courses/${recommendation.slug}`}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
                >
                  Start Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  )
}