'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  totalTime: number // in minutes
  coursesStarted: number
  lessonsViewed: number
  favoriteCategory: string | null
}

export default function ProgressStats() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [animatedValues, setAnimatedValues] = useState({ time: 0, courses: 0, lessons: 0 })

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('learnhub_stats')
    if (stored) {
      const data: LearningStats = JSON.parse(stored)
      setStats(data)
      
      // Animate the numbers
      animateValue('time', 0, data.totalTime, 1500)
      animateValue('courses', 0, data.coursesStarted, 1200)
      animateValue('lessons', 0, data.lessonsViewed, 1000)
    } else {
      // Initialize with demo data for new users
      const demoStats: LearningStats = {
        totalTime: 47,
        coursesStarted: 3,
        lessonsViewed: 12,
        favoriteCategory: 'Web Development',
      }
      localStorage.setItem('learnhub_stats', JSON.stringify(demoStats))
      setStats(demoStats)
      
      animateValue('time', 0, demoStats.totalTime, 1500)
      animateValue('courses', 0, demoStats.coursesStarted, 1200)
      animateValue('lessons', 0, demoStats.lessonsViewed, 1000)
    }
  }, [])

  const animateValue = (key: 'time' | 'courses' | 'lessons', start: number, end: number, duration: number) => {
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(start + (end - start) * easeOutCubic)
      
      setAnimatedValues(prev => ({ ...prev, [key]: currentValue }))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Learning Time */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 group hover:border-purple-500/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">⏱️</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {animatedValues.time}
              <span className="text-lg text-purple-400 ml-1">min</span>
            </div>
            <div className="text-navy-400 text-sm">Learning Time</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((stats.totalTime / 60) * 100, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-navy-500">Goal: 60 min/week</div>
      </div>

      {/* Courses Started */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 group hover:border-blue-500/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {animatedValues.courses}
            </div>
            <div className="text-navy-400 text-sm">Courses Started</div>
          </div>
        </div>
        <div className="mt-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className={`h-8 flex-1 rounded ${i < stats.coursesStarted ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-navy-800'} transition-all duration-500`}
              style={{ transitionDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-navy-500">Keep exploring!</div>
      </div>

      {/* Lessons Completed */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6 group hover:border-green-500/40 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">
              {animatedValues.lessons}
            </div>
            <div className="text-navy-400 text-sm">Lessons Viewed</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-1">
          {[...Array(18)].map((_, i) => (
            <div 
              key={i}
              className={`w-full aspect-square rounded-sm ${i < stats.lessonsViewed ? 'bg-green-500' : 'bg-navy-800'} transition-all duration-300`}
              style={{ transitionDelay: `${i * 50}ms`, opacity: i < stats.lessonsViewed ? 1 : 0.3 }}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-navy-500">
          {stats.favoriteCategory && `💡 Focused on ${stats.favoriteCategory}`}
        </div>
      </div>
    </div>
  )
}