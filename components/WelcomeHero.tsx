'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WelcomeHeroProps {
  coursesCount: number
}

export default function WelcomeHero({ coursesCount }: WelcomeHeroProps) {
  const [greeting, setGreeting] = useState('Hello')
  const [emoji, setEmoji] = useState('👋')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning')
      setEmoji('☀️')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon')
      setEmoji('🌤️')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening')
      setEmoji('🌆')
    } else {
      setGreeting('Late Night Learner')
      setEmoji('🌙')
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            {['📚', '💡', '🎯', '⭐', '🚀', '💻'][i]}
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Time-based greeting */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full mb-6 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xl">{emoji}</span>
            <span className="text-sm text-navy-300">{greeting}, ready to learn?</span>
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
            <Link 
              href="/courses" 
              className="btn-primary text-lg group"
            >
              Browse {coursesCount}+ Courses
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <Link 
              href="/categories" 
              className="btn-secondary text-lg"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}