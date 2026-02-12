'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnimatedHeroProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  totalLessons: number
}

const taglines = [
  "advance your career",
  "build real projects",
  "learn from experts",
  "master new skills",
  "achieve your goals"
]

export default function AnimatedHero({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  totalLessons 
}: AnimatedHeroProps) {
  const [currentTagline, setCurrentTagline] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)
  const [animatedLessons, setAnimatedLessons] = useState(0)

  // Typing animation effect
  useEffect(() => {
    const currentText = taglines[currentTagline]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentTagline((prev) => (prev + 1) % taglines.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTagline])

  // Counter animation effect
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedCourses(Math.floor(coursesCount * easeOut))
      setAnimatedInstructors(Math.floor(instructorsCount * easeOut))
      setAnimatedCategories(Math.floor(categoriesCount * easeOut))
      setAnimatedLessons(Math.floor(totalLessons * easeOut))

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedCourses(coursesCount)
        setAnimatedInstructors(instructorsCount)
        setAnimatedCategories(categoriesCount)
        setAnimatedLessons(totalLessons)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount, totalLessons])

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
            className="absolute w-2 h-2 bg-primary-500/20 rounded-full animate-float"
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
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Now with {animatedLessons}+ video lessons
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn skills that
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 min-h-[1.2em]">
              {displayText}
              <span className="animate-blink">|</span>
            </span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Master web development, design, and more with expert-led courses. 
            Start your learning journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/courses" className="btn-primary text-lg group">
              Browse Courses
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/categories" className="btn-secondary text-lg">
              Explore Categories
            </Link>
          </div>
        </div>
        
        {/* Animated Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedCourses}+
            </div>
            <div className="text-navy-400 text-sm">Courses</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedLessons}+
            </div>
            <div className="text-navy-400 text-sm">Lessons</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedInstructors}+
            </div>
            <div className="text-navy-400 text-sm">Instructors</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {animatedCategories}
            </div>
            <div className="text-navy-400 text-sm">Categories</div>
          </div>
        </div>
      </div>
    </section>
  )
}