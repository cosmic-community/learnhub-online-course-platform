'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

const motivationalQuotes = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Learning is not attained by chance, it must be sought for with ardor.", author: "Abigail Adams" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
]

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
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
  
  return <span>{displayValue}{suffix}</span>
}

function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 300)
    return () => clearTimeout(timer)
  }, [progress])
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(animatedProgress)}%</span>
      </div>
    </div>
  )
}

function StreakFire({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>🔥</span>
        {streak >= 7 && (
          <span className="absolute -top-1 -right-1 text-lg animate-pulse">✨</span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">
          <AnimatedNumber value={streak} />
        </div>
        <div className="text-sm text-navy-400">Day Streak</div>
      </div>
    </div>
  )
}

export default function LearningStats({ totalCourses, totalLessons, totalHours }: LearningStatsProps) {
  const [quote, setQuote] = useState(motivationalQuotes[0])
  const [isVisible, setIsVisible] = useState(false)
  
  // Simulate a learning streak (in real app, this would come from user data)
  const streak = Math.floor(Math.random() * 14) + 1
  
  // Simulate progress (in real app, this would come from user data)
  const overallProgress = Math.floor(Math.random() * 40) + 10
  
  useEffect(() => {
    // Select quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length])
    
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
          <p className="text-navy-400">Track your progress and stay motivated</p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Progress Ring Card */}
          <div className="card p-6 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
            <ProgressRing progress={overallProgress} />
            <p className="mt-4 text-navy-300 text-sm">Overall Progress</p>
          </div>
          
          {/* Streak Card */}
          <div className="card p-6 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
            <StreakFire streak={streak} />
            <p className="mt-2 text-navy-500 text-xs">
              {streak >= 7 ? "🎉 You're on fire!" : "Keep going!"}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={totalCourses} suffix="+" />
            </div>
            <p className="text-navy-400 text-sm">Courses Available</p>
          </div>
          
          <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-white">
              <AnimatedNumber value={totalHours} suffix="h" />
            </div>
            <p className="text-navy-400 text-sm">Of Learning Content</p>
          </div>
        </div>
        
        {/* Motivational Quote */}
        <div className={`mt-12 max-w-2xl mx-auto text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="card p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-4xl">💡</div>
            <blockquote className="text-lg text-navy-200 italic mb-3">
              "{quote.text}"
            </blockquote>
            <cite className="text-primary-400 text-sm font-medium">— {quote.author}</cite>
          </div>
        </div>
      </div>
    </section>
  )
}