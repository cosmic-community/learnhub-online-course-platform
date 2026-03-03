'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
  totalHours: number
}

const skills = [
  'React Development',
  'Node.js APIs',
  'Cloud Computing',
  'Vue.js Apps',
  'TypeScript',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
]

export default function HeroSection({ 
  courseCount, 
  instructorCount, 
  categoryCount,
  totalHours 
}: HeroSectionProps) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  // Typing effect
  useEffect(() => {
    const currentSkill = skills[currentSkillIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentSkill.length) {
          setDisplayedText(currentSkill.slice(0, displayedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentSkillIndex((prev) => (prev + 1) % skills.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentSkillIndex])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce-slow opacity-20">📚</div>
      <div className="absolute top-40 right-20 text-3xl animate-bounce-slow opacity-20" style={{ animationDelay: '0.5s' }}>💻</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-bounce-slow opacity-20" style={{ animationDelay: '1s' }}>🎯</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-bounce-slow opacity-20" style={{ animationDelay: '1.5s' }}>🚀</div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            {totalHours}+ hours of content available
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Master{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 inline-block min-w-[280px] text-left">
              {displayedText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
            </span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-8 max-w-2xl mx-auto">
            Learn from industry experts with hands-on projects. 
            Start your journey to becoming a better developer today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/courses" className="btn-primary text-lg group">
              <span>Browse Courses</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="#quiz" className="btn-secondary text-lg group">
              <span>Find Your Path</span>
              <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800">
              <div className="text-3xl font-bold text-white mb-1">{courseCount}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800">
              <div className="text-3xl font-bold text-white mb-1">{instructorCount}+</div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800">
              <div className="text-3xl font-bold text-white mb-1">{totalHours}+</div>
              <div className="text-navy-400 text-sm">Hours of Content</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/50 border border-navy-800">
              <div className="text-3xl font-bold text-white mb-1">{categoryCount}</div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}