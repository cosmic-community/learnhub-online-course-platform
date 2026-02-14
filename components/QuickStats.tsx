'use client'

import { useEffect, useState } from 'react'

interface QuickStatsProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
  lessonsCount: number
}

export default function QuickStats({ 
  coursesCount, 
  instructorsCount, 
  categoriesCount,
  lessonsCount 
}: QuickStatsProps) {
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({
    courses: 0,
    instructors: 0,
    categories: 0,
    lessons: 0
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true)
          animateNumbers()
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('quick-stats')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [animated, coursesCount, instructorsCount, categoriesCount, lessonsCount])

  const animateNumbers = () => {
    const duration = 2000
    const frameDuration = 1000 / 60
    const totalFrames = Math.round(duration / frameDuration)
    
    let frame = 0
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setCounts({
        courses: Math.round(coursesCount * easeOutQuart),
        instructors: Math.round(instructorsCount * easeOutQuart),
        categories: Math.round(categoriesCount * easeOutQuart),
        lessons: Math.round(lessonsCount * easeOutQuart)
      })

      if (frame === totalFrames) {
        clearInterval(timer)
        setCounts({
          courses: coursesCount,
          instructors: instructorsCount,
          categories: categoriesCount,
          lessons: lessonsCount
        })
      }
    }, frameDuration)
  }

  const stats = [
    { icon: '📚', value: counts.courses, label: 'Courses', suffix: '+' },
    { icon: '📖', value: counts.lessons, label: 'Lessons', suffix: '+' },
    { icon: '👨‍🏫', value: counts.instructors, label: 'Expert Instructors', suffix: '+' },
    { icon: '🏷️', value: counts.categories, label: 'Categories', suffix: '' }
  ]

  return (
    <div 
      id="quick-stats"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-2xl blur-xl group-hover:from-primary-500/20 transition-all duration-500" />
          <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 text-center hover:border-primary-500/50 transition-all duration-300">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-navy-400 text-sm">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}