'use client'

import { useEffect, useState, useRef } from 'react'

interface AchievementShowcaseProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  categories: number
}

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  value: number
  suffix: string
  color: string
  unlocked: boolean
}

export default function AchievementShowcase({ 
  totalCourses, 
  totalLessons, 
  totalHours, 
  categories 
}: AchievementShowcaseProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const achievements: Achievement[] = [
    {
      id: 'courses',
      icon: '📚',
      title: 'Course Collection',
      description: 'Premium courses available',
      value: totalCourses,
      suffix: '+',
      color: 'from-blue-500/20 to-blue-600/20',
      unlocked: totalCourses > 0
    },
    {
      id: 'lessons',
      icon: '🎬',
      title: 'Video Lessons',
      description: 'In-depth tutorials',
      value: totalLessons,
      suffix: '+',
      color: 'from-purple-500/20 to-purple-600/20',
      unlocked: totalLessons > 0
    },
    {
      id: 'hours',
      icon: '⏱️',
      title: 'Learning Hours',
      description: 'Hours of content',
      value: totalHours,
      suffix: 'h',
      color: 'from-primary-500/20 to-primary-600/20',
      unlocked: totalHours > 0
    },
    {
      id: 'categories',
      icon: '🎯',
      title: 'Skill Paths',
      description: 'Learning categories',
      value: categories,
      suffix: '',
      color: 'from-green-500/20 to-green-600/20',
      unlocked: categories > 0
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium mb-4">
            <span>🏆</span> Platform Stats
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Your Learning Awaits
          </h2>
          <p className="text-navy-400 max-w-lg mx-auto">
            Join our community of learners and unlock your potential
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              onMouseEnter={() => setHoveredId(achievement.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative bg-gradient-to-br ${achievement.color} 
                backdrop-blur-sm border border-navy-700/50 
                rounded-2xl p-6 text-center
                transform transition-all duration-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                ${hoveredId === achievement.id ? 'scale-105 border-primary-500/50 shadow-xl shadow-primary-500/10' : ''}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              {hoveredId === achievement.id && (
                <div className="absolute inset-0 bg-primary-500/5 rounded-2xl animate-pulse" />
              )}
              
              <div className="relative">
                {/* Icon with bounce animation */}
                <div className={`
                  text-4xl mb-3 
                  ${isVisible ? 'animate-bounce-subtle' : ''}
                `} style={{ animationDelay: `${index * 200}ms` }}>
                  {achievement.icon}
                </div>
                
                {/* Animated counter */}
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {isVisible ? (
                    <AnimatedCounter 
                      value={achievement.value} 
                      suffix={achievement.suffix}
                      delay={index * 100}
                    />
                  ) : (
                    <span>0{achievement.suffix}</span>
                  )}
                </div>
                
                <h3 className="text-sm font-semibold text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-xs text-navy-400">
                  {achievement.description}
                </p>
                
                {/* Unlocked badge */}
                {achievement.unlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Animated counter component
function AnimatedCounter({ value, suffix, delay }: { value: number; suffix: string; delay: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500
      const steps = 30
      const increment = value / steps
      let current = 0
      
      const counter = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(counter)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return <span>{count}{suffix}</span>
}