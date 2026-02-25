'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: string
}

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setTimeOfDay('morning')
    } else if (hour < 18) {
      setTimeOfDay('afternoon')
    } else {
      setTimeOfDay('evening')
    }

    // Get a personalized recommendation
    // In a real app, this would be based on user history
    const freeCourses = courses.filter(c => c.metadata?.is_free)
    const beginnerCourses = courses.filter(c => c.metadata?.difficulty?.value === 'Beginner' || c.metadata?.difficulty?.value === 'beginner')
    
    let recommendation: Course | null = null
    
    // Check if user has a last viewed course
    const lastViewed = localStorage.getItem('last-viewed-category')
    if (lastViewed) {
      const categoryMatch = courses.find(c => 
        c.metadata?.categories?.some((cat: { slug: string }) => cat.slug === lastViewed)
      )
      if (categoryMatch) recommendation = categoryMatch
    }
    
    // Fallback to beginner or free courses
    if (!recommendation && beginnerCourses.length > 0) {
      recommendation = beginnerCourses[Math.floor(Math.random() * beginnerCourses.length)] ?? null
    }
    if (!recommendation && freeCourses.length > 0) {
      recommendation = freeCourses[Math.floor(Math.random() * freeCourses.length)] ?? null
    }
    if (!recommendation && courses.length > 0) {
      recommendation = courses[0] ?? null
    }
    
    setRecommendedCourse(recommendation)
    
    // Trigger animation
    setTimeout(() => setIsVisible(true), 300)
  }, [courses])

  const greetings = {
    morning: { text: 'Good morning', emoji: '☀️', color: 'from-yellow-400 to-orange-400' },
    afternoon: { text: 'Good afternoon', emoji: '🌤️', color: 'from-blue-400 to-cyan-400' },
    evening: { text: 'Good evening', emoji: '🌙', color: 'from-purple-400 to-indigo-400' }
  }

  const quickActions: QuickAction[] = [
    {
      id: 'browse',
      title: 'Browse All Courses',
      description: 'Explore our full catalog',
      icon: '📚',
      href: '/courses',
      color: 'from-primary-400 to-primary-600'
    },
    {
      id: 'categories',
      title: 'By Category',
      description: 'Find courses by topic',
      icon: '🏷️',
      href: '/categories',
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 'contact',
      title: 'Get Help',
      description: 'Questions? Contact us',
      icon: '💬',
      href: '/contact',
      color: 'from-purple-400 to-violet-600'
    }
  ]

  const greeting = greetings[timeOfDay]

  return (
    <section className={`py-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-navy-900/50 border border-navy-800 mb-4">
            <span className="text-2xl">{greeting.emoji}</span>
            <span className={`text-lg font-medium bg-gradient-to-r ${greeting.color} text-transparent bg-clip-text`}>
              {greeting.text}! Ready to learn?
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Course */}
          {recommendedCourse && (
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs font-medium rounded-full">
                    ✨ Recommended for you
                  </span>
                </div>

                <div className="flex gap-4">
                  {recommendedCourse.metadata?.thumbnail?.imgix_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={`${recommendedCourse.metadata.thumbnail.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                        alt={recommendedCourse.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {recommendedCourse.metadata?.title || recommendedCourse.title}
                    </h3>
                    <p className="text-sm text-navy-400 mb-3 line-clamp-2">
                      {recommendedCourse.metadata?.tagline || 'Start your learning journey'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-navy-400">
                      {recommendedCourse.metadata?.difficulty?.value && (
                        <span className={`badge ${
                          recommendedCourse.metadata.difficulty.value.toLowerCase() === 'beginner' ? 'badge-beginner' :
                          recommendedCourse.metadata.difficulty.value.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                          'badge-advanced'
                        }`}>
                          {recommendedCourse.metadata.difficulty.value}
                        </span>
                      )}
                      {recommendedCourse.metadata?.estimated_hours && (
                        <span>⏱️ {recommendedCourse.metadata.estimated_hours}h</span>
                      )}
                      {recommendedCourse.metadata?.lessons?.length && (
                        <span>📖 {recommendedCourse.metadata.lessons.length} lessons</span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/courses/${recommendedCourse.slug}`}
                  className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
                >
                  <span>Start Learning</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={action.id}
                href={action.href}
                className="card p-4 group hover:border-primary-500/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-navy-400">{action.description}</p>
                  </div>
                  <svg 
                    className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="inline-block px-6 py-3 rounded-xl bg-navy-900/30 border border-navy-800/50">
            <p className="text-navy-400 text-sm italic">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p className="text-navy-500 text-xs mt-1">— B.B. King</p>
          </div>
        </div>
      </div>
    </section>
  )
}