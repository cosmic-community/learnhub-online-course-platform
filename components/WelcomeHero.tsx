'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WelcomeHeroProps {
  courseCount: number
  instructorCount: number
  categoryCount: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert" },
]

export default function WelcomeHero({ courseCount, instructorCount, categoryCount }: WelcomeHeroProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isAnimating, setIsAnimating] = useState(true)
  
  const fullText = "Learn skills that advance your career"
  
  // Typing animation effect
  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, displayedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      setIsAnimating(false)
    }
  }, [displayedText])
  
  // Random quote on each visit
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuote(motivationalQuotes[randomIndex])
  }, [])
  
  // Confetti on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('learnhub-visited')
    if (!hasVisited) {
      setShowConfetti(true)
      localStorage.setItem('learnhub-visited', 'true')
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#fbbf24', '#f472b6', '#818cf8'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated greeting badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-primary-400 text-sm font-medium">
              🎉 Welcome to your learning journey!
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight min-h-[1.2em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              {displayedText}
              {isAnimating && <span className="animate-blink">|</span>}
            </span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-6">
            Master web development, design, and more with expert-led courses. 
            Start your learning journey today.
          </p>
          
          {/* Motivational Quote */}
          <div className="mb-8 p-4 rounded-xl bg-navy-900/50 border border-navy-800 backdrop-blur-sm">
            <p className="text-navy-300 italic text-lg">"{quote.text}"</p>
            <p className="text-primary-400 text-sm mt-2">— {quote.author}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn-primary text-lg group">
              <span>Browse Courses</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/categories" className="btn-secondary text-lg">
              Explore Categories
            </Link>
          </div>
        </div>
        
        {/* Animated Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <StatCard number={courseCount} label="Courses" icon="📚" delay={0} />
          <StatCard number={instructorCount} label="Instructors" icon="👨‍🏫" delay={0.2} />
          <StatCard number={categoryCount} label="Categories" icon="🏷️" delay={0.4} />
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  number: number
  label: string
  icon: string
  delay: number
}

function StatCard({ number, label, icon, delay }: StatCardProps) {
  const [displayNumber, setDisplayNumber] = useState(0)
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1500
      const steps = 30
      const increment = number / steps
      let current = 0
      
      const interval = setInterval(() => {
        current += increment
        if (current >= number) {
          setDisplayNumber(number)
          clearInterval(interval)
        } else {
          setDisplayNumber(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(interval)
    }, delay * 1000)
    
    return () => clearTimeout(timeout)
  }, [number, delay])
  
  return (
    <div 
      className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover:border-primary-500/30 transition-all duration-300 hover:scale-105 group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl font-bold text-white">{displayNumber}+</div>
      <div className="text-navy-400 text-sm">{label}</div>
    </div>
  )
}