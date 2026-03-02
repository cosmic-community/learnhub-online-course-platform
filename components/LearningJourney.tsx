'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Category } from '@/types'

interface LearningJourneyProps {
  totalCourses: number
  totalHours: number
  totalLessons: number
  categories: Category[]
}

const milestones = [
  { icon: '🚀', label: 'Start Learning', description: 'Begin your journey' },
  { icon: '📚', label: 'First Course', description: 'Complete your first course' },
  { icon: '⭐', label: 'Rising Star', description: 'Finish 5 courses' },
  { icon: '🏆', label: 'Master', description: 'Become an expert' },
]

export default function LearningJourney({ 
  totalCourses, 
  totalHours, 
  totalLessons,
  categories 
}: LearningJourneyProps) {
  const [animatedHours, setAnimatedHours] = useState(0)
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Animate numbers on mount
  useEffect(() => {
    setIsVisible(true)
    
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedHours(Math.round(totalHours * easeOut))
      setAnimatedCourses(Math.round(totalCourses * easeOut))
      setAnimatedLessons(Math.round(totalLessons * easeOut))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [totalHours, totalCourses, totalLessons])

  // Animate milestone steps
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % milestones.length)
    }, 3000)
    
    return () => clearInterval(stepTimer)
  }, [])

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Main Journey Card */}
      <div className="card p-8 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 animate-pulse" />
        
        <div className="relative">
          {/* Stats Row with Animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6 bg-navy-800/50 rounded-xl border border-navy-700/50 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2">
                {animatedHours}+
              </div>
              <div className="text-navy-300 text-sm uppercase tracking-wide">Hours of Content</div>
              <div className="mt-2 text-2xl">⏱️</div>
            </div>
            
            <div className="text-center p-6 bg-navy-800/50 rounded-xl border border-navy-700/50 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
                {animatedCourses}
              </div>
              <div className="text-navy-300 text-sm uppercase tracking-wide">Courses Available</div>
              <div className="mt-2 text-2xl">📖</div>
            </div>
            
            <div className="text-center p-6 bg-navy-800/50 rounded-xl border border-navy-700/50 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {animatedLessons}
              </div>
              <div className="text-navy-300 text-sm uppercase tracking-wide">Total Lessons</div>
              <div className="mt-2 text-2xl">🎯</div>
            </div>
          </div>

          {/* Milestone Progress */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Your Path to Mastery</h3>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-700 -translate-y-1/2 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${((activeStep + 1) / milestones.length) * 100}%` }}
                />
              </div>
              
              {/* Milestone Points */}
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.label}
                  className={`relative flex flex-col items-center transition-all duration-500 ${
                    index <= activeStep ? 'scale-110' : 'scale-100 opacity-50'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl z-10 transition-all duration-500 ${
                    index <= activeStep 
                      ? 'bg-gradient-to-br from-primary-500 to-purple-500 shadow-lg shadow-primary-500/30' 
                      : 'bg-navy-700'
                  }`}>
                    {milestone.icon}
                  </div>
                  <div className="mt-3 text-center hidden sm:block">
                    <div className={`text-sm font-medium transition-colors ${
                      index <= activeStep ? 'text-white' : 'text-navy-500'
                    }`}>
                      {milestone.label}
                    </div>
                    <div className="text-xs text-navy-500 mt-1 max-w-[100px]">
                      {milestone.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Category Access */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Start with a Skill</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className={`group p-4 bg-navy-800/30 rounded-xl border border-navy-700/50 hover:border-primary-500/50 
                      hover:bg-navy-800/60 transition-all duration-300 text-center transform hover:-translate-y-1
                      ${isVisible ? 'animate-fadeIn' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.metadata?.icon || '📂'}
                    </div>
                    <div className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors">
                      {category.metadata?.name || category.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-2 btn-primary group"
            >
              Start Your Journey
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}