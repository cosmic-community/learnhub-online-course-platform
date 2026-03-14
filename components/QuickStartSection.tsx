'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
}

export default function QuickStartSection({ courses }: QuickStartSectionProps) {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')

  useEffect(() => {
    // Determine time of day for personalized greeting
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else setTimeOfDay('evening')

    // Check for returning user preferences
    const savedInterest = localStorage.getItem('learning-interest')
    if (savedInterest) {
      setSelectedInterest(savedInterest)
    }

    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const interests = [
    { id: 'web', label: 'Web Development', emoji: '🌐', keywords: ['web', 'react', 'vue', 'javascript', 'frontend', 'html', 'css'] },
    { id: 'backend', label: 'Backend', emoji: '⚙️', keywords: ['node', 'backend', 'api', 'database', 'server'] },
    { id: 'cloud', label: 'Cloud & DevOps', emoji: '☁️', keywords: ['aws', 'cloud', 'devops', 'docker', 'kubernetes'] },
    { id: 'mobile', label: 'Mobile Apps', emoji: '📱', keywords: ['mobile', 'ios', 'android', 'react native', 'flutter'] },
  ]

  const handleInterestSelect = (interestId: string) => {
    setSelectedInterest(interestId)
    localStorage.setItem('learning-interest', interestId)
  }

  const getRecommendedCourses = () => {
    if (!selectedInterest) return courses.slice(0, 2)
    
    const interest = interests.find(i => i.id === selectedInterest)
    if (!interest) return courses.slice(0, 2)
    
    const matchingCourses = courses.filter(course => {
      const title = course.title.toLowerCase()
      const description = course.metadata?.description?.toLowerCase() || ''
      const tagline = course.metadata?.tagline?.toLowerCase() || ''
      
      return interest.keywords.some(keyword => 
        title.includes(keyword) || description.includes(keyword) || tagline.includes(keyword)
      )
    })
    
    return matchingCourses.length > 0 ? matchingCourses.slice(0, 2) : courses.slice(0, 2)
  }

  const greetings = {
    morning: { text: 'Good morning', emoji: '☀️' },
    afternoon: { text: 'Good afternoon', emoji: '🌤️' },
    evening: { text: 'Good evening', emoji: '🌙' }
  }

  const recommendedCourses = getRecommendedCourses()

  return (
    <section 
      className={`py-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 bg-gradient-to-r from-navy-900/80 to-navy-800/50 border-primary-500/10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left side - Interest selection */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">{greetings[timeOfDay].emoji}</span>
                <h3 className="text-xl font-semibold text-white">
                  {greetings[timeOfDay].text}! What do you want to learn?
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestSelect(interest.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left group ${
                      selectedInterest === interest.id
                        ? 'bg-primary-500/20 border-primary-500 text-white'
                        : 'bg-navy-800/50 border-navy-700 text-navy-300 hover:border-navy-600 hover:bg-navy-800'
                    }`}
                  >
                    <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{interest.emoji}</span>
                    <span className="font-medium text-sm">{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden lg:block w-px h-48 bg-navy-700" />
            <div className="lg:hidden w-full h-px bg-navy-700" />
            
            {/* Right side - Recommendations */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h4 className="text-lg font-semibold text-white">
                  {selectedInterest ? 'Recommended for you' : 'Popular picks'}
                </h4>
              </div>
              
              <div className="space-y-3">
                {recommendedCourses.map((course, index) => (
                  <Link 
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="block p-4 rounded-xl bg-navy-800/50 border border-navy-700 hover:border-primary-500/50 hover:bg-navy-800 transition-all duration-200 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      {course.metadata?.thumbnail?.imgix_url ? (
                        <img 
                          src={`${course.metadata.thumbnail.imgix_url}?w=120&h=80&fit=crop&auto=format,compress`}
                          alt={course.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center">
                          <span className="text-xl">📚</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">
                          {course.metadata?.title || course.title}
                        </h5>
                        <p className="text-sm text-navy-400 truncate">
                          {course.metadata?.tagline || 'Start learning today'}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link 
                href="/courses" 
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium mt-4 transition-colors"
              >
                View all courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}