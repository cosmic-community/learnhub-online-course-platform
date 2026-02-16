'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnimatedHeroProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

const floatingIcons = ['💻', '🎨', '📱', '☁️', '🔐', '📊', '🚀', '⚡', '🎯', '💡']

export default function AnimatedHero({ coursesCount, instructorsCount, categoriesCount }: AnimatedHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x}px), ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((icon, index) => (
          <div
            key={index}
            className={`absolute text-2xl opacity-20 animate-float transition-transform duration-1000 ${isLoaded ? 'opacity-20' : 'opacity-0'}`}
            style={{
              left: `${10 + (index * 9)}%`,
              top: `${15 + (index % 3) * 25}%`,
              animationDelay: `${index * 0.3}s`,
              animationDuration: `${4 + (index % 3)}s`,
              transform: `translate(${mousePosition.x * (0.1 + index * 0.05)}px, ${mousePosition.y * (0.1 + index * 0.05)}px)`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6 animate-pulse">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-ping" />
            New courses added weekly
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn skills that
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-primary-600 animate-gradient-x"> advance your career</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 2" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" className="animate-draw"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8"/>
                    <stop offset="50%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#818cf8"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-8 leading-relaxed">
            Master web development, cloud computing, and more with expert-led courses. 
            <span className="text-white font-medium"> Start your learning journey today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/courses" 
              className="btn-primary text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Browse Courses
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="/categories" 
              className="btn-secondary text-lg group"
            >
              <span className="flex items-center gap-2">
                Explore Categories
                <span className="transition-transform group-hover:rotate-12">🎯</span>
              </span>
            </Link>
          </div>
        </div>
        
        {/* Animated Stats */}
        <div className={`mt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {coursesCount}+
              </div>
              <div className="absolute -inset-2 bg-primary-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-navy-400 text-sm mt-1">Courses</div>
          </div>
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {instructorsCount}+
              </div>
              <div className="absolute -inset-2 bg-primary-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-navy-400 text-sm mt-1">Expert Instructors</div>
          </div>
          <div className="text-center group">
            <div className="relative inline-block">
              <div className="text-4xl font-bold text-white group-hover:text-primary-400 transition-colors">
                {categoriesCount}
              </div>
              <div className="absolute -inset-2 bg-primary-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-navy-400 text-sm mt-1">Categories</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2 text-navy-500">
            <span className="text-xs">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-navy-700 rounded-full p-1">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}