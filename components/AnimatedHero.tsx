'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnimatedHeroProps {
  totalCourses: number
  totalInstructors: number
  totalCategories: number
  totalLearningHours: number
  totalLessons: number
}

const phrases = [
  'advance your career',
  'build your future',
  'master new skills',
  'unlock your potential',
  'transform your life'
]

export default function AnimatedHero({ 
  totalCourses, 
  totalInstructors, 
  totalCategories,
  totalLearningHours,
  totalLessons
}: AnimatedHeroProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]
    
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false)
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        return
      }
      
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1))
      }, 30)
      return () => clearTimeout(timeout)
    }

    if (displayText === currentPhrase) {
      setIsPaused(true)
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText(currentPhrase.slice(0, displayText.length + 1))
    }, 80)
    
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isPaused, currentPhraseIndex])

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            {totalLessons}+ lessons available
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn skills that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              {displayText}
              <span className="animate-blink">|</span>
            </span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-8 max-w-2xl mx-auto">
            Master web development, cloud computing, and more with expert-led courses. 
            Join {totalLearningHours}+ hours of immersive learning content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/courses" 
              className="btn-primary text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Browse Courses
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link href="/categories" className="btn-secondary text-lg">
              Explore Categories
            </Link>
          </div>
          
          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {totalCourses}+
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {totalInstructors}+
              </div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {totalCategories}
              </div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}