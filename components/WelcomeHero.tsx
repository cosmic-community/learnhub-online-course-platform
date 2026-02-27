'use client'

import { useState, useEffect } from 'react'

interface WelcomeHeroProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
}

export default function WelcomeHero({ courseCount, instructorCount, categoryCount }: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState('Hello')
  const [timeEmoji, setTimeEmoji] = useState('👋')
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  
  const fullText = "Learn skills that advance your career"
  
  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning')
      setTimeEmoji('🌅')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon')
      setTimeEmoji('☀️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good evening')
      setTimeEmoji('🌆')
    } else {
      setGreeting('Good night')
      setTimeEmoji('🌙')
    }
    
    setIsVisible(true)
    
    // Typewriter effect
    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)
    
    return () => clearInterval(typeInterval)
  }, [])
  
  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          >
            <div className={`w-${2 + i} h-${2 + i} rounded-full bg-primary-400`} />
          </div>
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Time-based greeting */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 backdrop-blur-sm rounded-full mb-6 animate-slideDown">
            <span className="text-xl">{timeEmoji}</span>
            <span className="text-navy-300">{greeting}, learner!</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="relative">
              {typedText.split(' ').map((word, i) => (
                <span key={i}>
                  {i === typedText.split(' ').length - 1 && i > 3 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {' '}
                </span>
              ))}
              <span className="animate-blink">|</span>
            </span>
          </h1>
          
          <p className={`text-xl text-navy-300 mb-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Master web development, design, and more with expert-led courses. 
            Start your learning journey today.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <a href="/courses" className="btn-primary text-lg group">
              Browse Courses
              <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="/categories" className="btn-secondary text-lg">
              Explore Categories
            </a>
          </div>
        </div>
        
        {/* Animated Stats */}
        <div className={`mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <StatCounter value={courseCount} label="Courses" suffix="+" />
          <StatCounter value={instructorCount} label="Instructors" suffix="+" />
          <StatCounter value={categoryCount} label="Categories" />
        </div>
      </div>
    </section>
  )
}

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  return (
    <div className="text-center group">
      <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
        {displayValue}{suffix}
      </div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}