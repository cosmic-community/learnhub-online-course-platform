'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getMotivationalMessage(): string {
  const messages = [
    "Ready to level up your skills?",
    "Your learning journey starts here!",
    "Discover something new today!",
    "Transform your career with knowledge!",
    "Every expert was once a beginner.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export default function HeroSection({ coursesCount, instructorsCount, categoriesCount }: HeroSectionProps) {
  const [greeting, setGreeting] = useState('Welcome')
  const [motivation, setMotivation] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    setGreeting(getGreeting())
    setMotivation(getMotivationalMessage())
    setIsVisible(true)
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slower" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Personalized Greeting */}
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="text-2xl">👋</span>
            <span className="text-primary-300 font-medium">{greeting}! {motivation}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn skills that
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
          </h1>
          <p className="text-xl text-navy-300 mb-8">
            Master web development, design, and more with expert-led courses. 
            Start your learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        
        {/* Enhanced Stats with Animation */}
        <div className={`mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <StatCard value={coursesCount} label="Courses" icon="📚" delay={0} />
          <StatCard value={instructorsCount} label="Instructors" icon="👨‍🏫" delay={100} />
          <StatCard value={categoriesCount} label="Categories" icon="🏷️" delay={200} />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, label, icon, delay }: { value: number; label: string; icon: string; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)
      
      const counter = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayValue(end)
          clearInterval(counter)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(counter)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return (
    <div className="text-center group cursor-default">
      <div className="text-3xl mb-2 transform group-hover:scale-125 transition-transform duration-300">{icon}</div>
      <div className="text-3xl font-bold text-white">{displayValue}+</div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}