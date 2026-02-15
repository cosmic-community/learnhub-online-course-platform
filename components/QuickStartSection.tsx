'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface QuickStartSectionProps {
  courses: Course[]
  categories: Category[]
}

const skillLevels = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', description: 'New to coding' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🌿', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', emoji: '🌳', description: 'Expert level' },
]

const timeCommitments = [
  { id: 'quick', label: 'Quick Learn', hours: 2, emoji: '⚡' },
  { id: 'standard', label: 'Standard', hours: 5, emoji: '📚' },
  { id: 'deep', label: 'Deep Dive', hours: 10, emoji: '🎓' },
]

export default function QuickStartSection({ courses, categories }: QuickStartSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load preferences from localStorage
    const savedLevel = localStorage.getItem('learnhub_skill_level')
    const savedTime = localStorage.getItem('learnhub_time_commitment')
    if (savedLevel) setSelectedLevel(savedLevel)
    if (savedTime) setSelectedTime(savedTime)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Save preferences
    if (selectedLevel) localStorage.setItem('learnhub_skill_level', selectedLevel)
    if (selectedTime) localStorage.setItem('learnhub_time_commitment', selectedTime)

    // Filter courses based on selections
    let filtered = [...courses]
    
    if (selectedLevel) {
      filtered = filtered.filter(course => {
        const difficulty = course.metadata?.difficulty?.key || course.metadata?.difficulty?.value?.toLowerCase()
        return difficulty === selectedLevel
      })
    }
    
    if (selectedTime) {
      const timeConfig = timeCommitments.find(t => t.id === selectedTime)
      if (timeConfig) {
        filtered = filtered.filter(course => {
          const hours = course.metadata?.estimated_hours || 0
          if (selectedTime === 'quick') return hours <= 3
          if (selectedTime === 'standard') return hours > 3 && hours <= 7
          return hours > 7
        })
      }
    }

    // If no matches, show all courses
    setRecommendations(filtered.length > 0 ? filtered.slice(0, 3) : courses.slice(0, 3))
  }, [selectedLevel, selectedTime, courses, mounted])

  if (!mounted) return null

  return (
    <section className="py-16 bg-navy-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">🎯</span>
            Quick Start
          </h2>
          <p className="text-navy-400">Tell us about yourself and we'll recommend the perfect course</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Skill Level Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-navy-300">Your skill level</label>
            <div className="grid grid-cols-3 gap-3">
              {skillLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                    selectedLevel === level.id
                      ? 'border-primary-500 bg-primary-500/10 scale-105'
                      : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                  }`}
                >
                  <span className={`text-2xl block mb-1 transition-transform group-hover:scale-110 ${selectedLevel === level.id ? 'animate-bounce-slow' : ''}`}>
                    {level.emoji}
                  </span>
                  <span className={`text-sm font-medium ${selectedLevel === level.id ? 'text-primary-400' : 'text-white'}`}>
                    {level.label}
                  </span>
                  <span className="text-xs text-navy-500 block mt-1">{level.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Commitment Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-navy-300">Time you can commit</label>
            <div className="grid grid-cols-3 gap-3">
              {timeCommitments.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setSelectedTime(selectedTime === time.id ? null : time.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                    selectedTime === time.id
                      ? 'border-primary-500 bg-primary-500/10 scale-105'
                      : 'border-navy-700 bg-navy-800/50 hover:border-navy-600'
                  }`}
                >
                  <span className={`text-2xl block mb-1 transition-transform group-hover:scale-110 ${selectedTime === time.id ? 'animate-bounce-slow' : ''}`}>
                    {time.emoji}
                  </span>
                  <span className={`text-sm font-medium ${selectedTime === time.id ? 'text-primary-400' : 'text-white'}`}>
                    {time.label}
                  </span>
                  <span className="text-xs text-navy-500 block mt-1">~{time.hours}h</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {(selectedLevel || selectedTime) && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <span className="text-navy-300 text-sm">
                {recommendations.length > 0 
                  ? `Perfect matches for you:`
                  : 'Showing our top courses:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {recommendations.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-navy-800/50 border border-navy-700 rounded-xl hover:border-primary-500/50 hover:bg-navy-800 transition-all group"
                >
                  {course.metadata?.thumbnail && (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="text-white font-medium group-hover:text-primary-400 transition-colors text-sm">
                      {course.title}
                    </div>
                    <div className="text-xs text-navy-400 flex items-center gap-2">
                      <span>{course.metadata?.lessons?.length || 0} lessons</span>
                      <span>•</span>
                      <span>{course.metadata?.estimated_hours || 0}h</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-navy-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}