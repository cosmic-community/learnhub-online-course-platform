'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartCardProps {
  courses: Course[]
}

export default function QuickStartCard({ courses }: QuickStartCardProps) {
  const [currentTip, setCurrentTip] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const learningTips = [
    { emoji: '🎯', tip: 'Set a daily learning goal of just 15 minutes to build consistency' },
    { emoji: '📝', tip: 'Take notes while learning to improve retention by up to 50%' },
    { emoji: '🔄', tip: 'Review completed lessons after a week to reinforce knowledge' },
    { emoji: '💡', tip: 'Practice coding along with video lessons for better understanding' },
    { emoji: '🤝', tip: 'Share your progress with friends for accountability' },
  ]

  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isHovered, learningTips.length])

  // Get a recommended course (random from first 3)
  const recommendedCourse = courses[Math.floor(Math.random() * Math.min(3, courses.length))]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Start Card */}
      <div className="card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl">
              🚀
            </div>
            <h3 className="text-lg font-semibold text-white">Quick Start</h3>
          </div>

          {recommendedCourse && (
            <div className="mb-4">
              <p className="text-navy-400 text-sm mb-3">Recommended for you:</p>
              <Link 
                href={`/courses/${recommendedCourse.slug}`}
                className="block bg-navy-800/50 rounded-xl p-4 hover:bg-navy-800 transition-colors group/link"
              >
                <div className="flex items-start gap-4">
                  {recommendedCourse.metadata?.thumbnail ? (
                    <img
                      src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=160&h=90&fit=crop&auto=format,compress`}
                      alt={recommendedCourse.title}
                      className="w-20 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-12 bg-navy-700 rounded-lg flex items-center justify-center text-2xl">
                      📚
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm group-hover/link:text-primary-400 transition-colors line-clamp-1">
                      {recommendedCourse.title}
                    </h4>
                    <p className="text-navy-400 text-xs mt-1 line-clamp-1">
                      {recommendedCourse.metadata?.tagline || 'Start learning today'}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-navy-500 group-hover/link:text-primary-400 group-hover/link:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          )}

          <Link href="/courses" className="btn-primary w-full justify-center text-sm">
            Browse All Courses
          </Link>
        </div>
      </div>

      {/* Learning Tip Card */}
      <div 
        className="card p-6 relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl">
              💡
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Learning Tip</h3>
              <p className="text-navy-500 text-xs">Updated every 5 seconds</p>
            </div>
          </div>

          <div className="min-h-[80px] flex items-center">
            <div className="flex items-start gap-3 animate-fade-in" key={currentTip}>
              <span className="text-2xl">{learningTips[currentTip].emoji}</span>
              <p className="text-navy-300 text-sm leading-relaxed">
                {learningTips[currentTip].tip}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {learningTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTip 
                    ? 'bg-primary-500 w-6' 
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}