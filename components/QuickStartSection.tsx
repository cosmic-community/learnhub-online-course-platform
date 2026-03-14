'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

function getTimeBasedSuggestion(): { title: string; description: string; emoji: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      title: 'Morning Learning',
      description: 'Start your day with focused learning. Your brain is fresh and ready!',
      emoji: '🌅'
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      title: 'Afternoon Deep Dive',
      description: 'Perfect time for hands-on practice and projects.',
      emoji: '☀️'
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      title: 'Evening Review',
      description: 'Great time to review concepts and watch video lessons.',
      emoji: '🌆'
    }
  } else {
    return {
      title: 'Night Owl Session',
      description: 'Quiet hours for focused study. Take breaks!',
      emoji: '🌙'
    }
  }
}

function getQuickTip(): string {
  const tips = [
    '💡 Take notes while watching - it improves retention by 50%!',
    '💡 Practice coding along with the videos for best results.',
    '💡 Review yesterday\'s lesson before starting a new one.',
    '💡 Set a timer for 25-minute focused learning sessions.',
    '💡 Teach someone else what you learned to solidify knowledge.',
    '💡 Take a 5-minute break every 30 minutes of study.',
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [suggestion, setSuggestion] = useState<ReturnType<typeof getTimeBasedSuggestion> | null>(null)
  const [quickTip, setQuickTip] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSuggestion(getTimeBasedSuggestion())
    setQuickTip(getQuickTip())
    setSelectedIndex(Math.floor(Math.random() * Math.min(courses.length, 3)))
  }, [courses.length])

  // Get beginner-friendly or free courses for quick start
  const quickStartCourses = courses
    .filter(c => c.metadata?.is_free || c.metadata?.difficulty?.value === 'Beginner')
    .slice(0, 3)

  const recommendedCourse = quickStartCourses[selectedIndex] || courses[0]

  if (!suggestion || !recommendedCourse) return null

  return (
    <section className="py-12 border-b border-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time-based Suggestion */}
          <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-transparent">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{suggestion.emoji}</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{suggestion.title}</h3>
                <p className="text-navy-300 text-sm">{suggestion.description}</p>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="card p-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
            <p className="text-navy-200 text-sm leading-relaxed">{quickTip}</p>
          </div>

          {/* Quick Start Course */}
          <div className="card p-6 bg-gradient-to-br from-green-500/10 to-transparent">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-green-400 font-medium">Quick Start</span>
                  {recommendedCourse.metadata?.is_free && (
                    <span className="badge badge-free text-xs">Free</span>
                  )}
                </div>
                <h3 className="text-white font-medium mb-1 line-clamp-1">
                  {recommendedCourse.metadata?.title || recommendedCourse.title}
                </h3>
                <p className="text-navy-400 text-sm mb-3 line-clamp-1">
                  {recommendedCourse.metadata?.tagline}
                </p>
                <Link 
                  href={`/courses/${recommendedCourse.slug}`}
                  className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors group"
                >
                  <span>Start Learning</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              {recommendedCourse.metadata?.thumbnail?.imgix_url && (
                <img 
                  src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover ml-4 hidden sm:block"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}