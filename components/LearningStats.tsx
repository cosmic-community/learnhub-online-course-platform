'use client'

import { useState, useEffect } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [end, duration])

  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  )
}

interface LearningStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function LearningStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: LearningStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { 
      id: 'courses',
      value: coursesCount, 
      label: 'Courses', 
      icon: '📚',
      suffix: '+',
      color: 'from-primary-400 to-primary-600',
      description: 'Expert-crafted learning paths'
    },
    { 
      id: 'lessons',
      value: lessonsCount, 
      label: 'Lessons', 
      icon: '📖',
      suffix: '+',
      color: 'from-blue-400 to-blue-600',
      description: 'In-depth video tutorials'
    },
    { 
      id: 'instructors',
      value: instructorsCount, 
      label: 'Instructors', 
      icon: '👨‍🏫',
      suffix: '+',
      color: 'from-purple-400 to-purple-600',
      description: 'Industry professionals'
    },
    { 
      id: 'categories',
      value: categoriesCount, 
      label: 'Categories', 
      icon: '🏷️',
      suffix: '',
      color: 'from-amber-400 to-amber-600',
      description: 'Diverse learning topics'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className={`relative group cursor-pointer transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
          onMouseEnter={() => setHoveredStat(stat.id)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div className={`
            relative p-4 md:p-6 rounded-2xl bg-navy-900/50 border border-navy-800
            transition-all duration-300 overflow-hidden
            ${hoveredStat === stat.id ? 'border-primary-500/50 scale-105 shadow-lg shadow-primary-500/10' : ''}
          `}>
            {/* Animated background gradient */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0
              transition-opacity duration-300
              ${hoveredStat === stat.id ? 'opacity-10' : ''}
            `} />
            
            {/* Content */}
            <div className="relative text-center">
              <div className={`
                text-3xl mb-2 transition-transform duration-300
                ${hoveredStat === stat.id ? 'scale-125 animate-bounce' : ''}
              `}>
                {stat.icon}
              </div>
              
              <div className={`
                text-2xl md:text-3xl font-bold text-white mb-1
                bg-gradient-to-r ${stat.color} bg-clip-text
                ${hoveredStat === stat.id ? 'text-transparent' : ''}
              `}>
                {isVisible ? (
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    duration={1500 + index * 200}
                  />
                ) : '0'}
              </div>
              
              <div className="text-navy-400 text-sm font-medium">
                {stat.label}
              </div>

              {/* Hover tooltip */}
              <div className={`
                absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full
                bg-navy-800 px-3 py-1.5 rounded-lg text-xs text-navy-300
                whitespace-nowrap transition-all duration-300 z-10
                ${hoveredStat === stat.id ? 'opacity-100 translate-y-full' : 'opacity-0 translate-y-2'}
              `}>
                {stat.description}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-800 rotate-45" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}