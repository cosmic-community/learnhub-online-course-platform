'use client'

import { useEffect, useState, useRef } from 'react'

interface LearningPathVisualizationProps {
  totalHours: number
  coursesCount: number
  categoriesCount: number
}

export default function LearningPathVisualization({ 
  totalHours, 
  coursesCount,
  categoriesCount 
}: LearningPathVisualizationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgress(75)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const milestones = [
    { label: 'Start', icon: '🚀', position: 0 },
    { label: 'First Course', icon: '📚', position: 25 },
    { label: 'Skills Growing', icon: '🌱', position: 50 },
    { label: 'Expert Level', icon: '⭐', position: 75 },
    { label: 'Master', icon: '🏆', position: 100 },
  ]

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Your Learning Journey Awaits
          </h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            With <span className="text-primary-400 font-semibold">{totalHours}+ hours</span> of content across{' '}
            <span className="text-primary-400 font-semibold">{coursesCount} courses</span>, 
            you can go from beginner to expert
          </p>
        </div>

        {/* Progress Path */}
        <div className="relative pt-8 pb-4">
          {/* Background track */}
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-navy-800 rounded-full -translate-y-1/2" />
          
          {/* Animated progress */}
          <div 
            className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 rounded-full -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Glow effect */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-400 rounded-full blur-sm" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>

          {/* Milestones */}
          <div className="relative flex justify-between">
            {milestones.map((milestone, index) => {
              const isActive = progress >= milestone.position
              const isCurrent = progress >= milestone.position && progress < (milestones[index + 1]?.position ?? 101)
              
              return (
                <div 
                  key={milestone.label}
                  className={`flex flex-col items-center transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl
                      transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary-500 shadow-lg shadow-primary-500/30 scale-110' 
                          : 'bg-navy-800 border-2 border-navy-700'
                      } ${isCurrent ? 'ring-4 ring-primary-500/30 animate-pulse' : ''}`}
                  >
                    {milestone.icon}
                  </div>
                  <span className={`mt-2 text-xs md:text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-400' : 'text-navy-500'
                  }`}>
                    {milestone.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational message */}
        <div className={`text-center mt-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          <p className="text-lg text-navy-300">
            Every expert was once a beginner. <span className="text-primary-400">Start your journey today!</span>
          </p>
        </div>
      </div>
    </section>
  )
}