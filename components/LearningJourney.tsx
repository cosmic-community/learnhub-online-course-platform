'use client'

import { useState, useEffect } from 'react'

interface LearningJourneyProps {
  coursesCount: number
  lessonsCount: number
  totalHours: number
  categoriesCount: number
}

export default function LearningJourney({ 
  coursesCount, 
  lessonsCount, 
  totalHours, 
  categoriesCount 
}: LearningJourneyProps) {
  const [animatedStats, setAnimatedStats] = useState({
    courses: 0,
    lessons: 0,
    hours: 0,
    categories: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('learning-journey')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedStats({
        courses: Math.round(coursesCount * easeOut),
        lessons: Math.round(lessonsCount * easeOut),
        hours: Math.round(totalHours * easeOut),
        categories: Math.round(categoriesCount * easeOut)
      })

      if (step >= steps) {
        clearInterval(timer)
        // Show confetti celebration when animation completes
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, coursesCount, lessonsCount, totalHours, categoriesCount])

  const stats = [
    { 
      icon: '📚', 
      value: animatedStats.courses, 
      label: 'Courses', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Expert-crafted courses'
    },
    { 
      icon: '📖', 
      value: animatedStats.lessons, 
      label: 'Lessons', 
      color: 'from-purple-500 to-pink-500',
      description: 'In-depth video lessons'
    },
    { 
      icon: '⏱️', 
      value: animatedStats.hours, 
      label: 'Hours', 
      color: 'from-orange-500 to-red-500',
      description: 'Of learning content'
    },
    { 
      icon: '🎯', 
      value: animatedStats.categories, 
      label: 'Categories', 
      color: 'from-green-500 to-emerald-500',
      description: 'Skills to master'
    },
  ]

  return (
    <section id="learning-journey" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      
      {/* Confetti particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20 border border-primary-500/30 text-sm font-medium text-primary-300 mb-4">
            ✨ Your Learning Adventure Awaits
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            A World of Knowledge
          </h2>
          <p className="text-navy-300 text-lg max-w-2xl mx-auto">
            Dive into our comprehensive library of courses designed to transform your skills and accelerate your career.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="card p-6 text-center h-full hover:scale-105 transition-transform duration-300">
                {/* Gradient border effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}+
                  </div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-navy-400 text-sm">{stat.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-navy-400 mb-2">
            <span>Platform Growth</span>
            <span className="text-primary-400">Always expanding</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-2000 ${isVisible ? 'w-[85%]' : 'w-0'}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}