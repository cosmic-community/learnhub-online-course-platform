'use client'

import { useState, useEffect } from 'react'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
  totalInstructors: number
}

interface StatRingProps {
  value: number
  maxValue: number
  label: string
  icon: string
  color: string
  delay: number
}

function StatRing({ value, maxValue, label, icon, color, delay }: StatRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  const percentage = Math.min((animatedValue / maxValue) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return
    
    let startValue = 0
    const duration = 1500
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.round(startValue + (value - startValue) * easeOutQuart)
      
      setAnimatedValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, isVisible])

  return (
    <div 
      className={`flex flex-col items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        {/* Background ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-navy-800"
          />
          {/* Animated progress ring */}
          <circle
            cx="50%"
            cy="50%"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isVisible ? strokeDashoffset : circumference,
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
            className="drop-shadow-lg"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl mb-1">{icon}</span>
          <span className="text-xl sm:text-2xl font-bold text-white">{animatedValue}</span>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity duration-1000"
          style={{ 
            backgroundColor: color,
            opacity: isVisible ? 0.2 : 0 
          }}
        />
      </div>
      
      <span className="mt-3 text-sm sm:text-base text-navy-300 font-medium">{label}</span>
    </div>
  )
}

function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Simulate loading saved streak from localStorage
    const savedStreak = localStorage.getItem('learning-streak')
    const lastVisit = localStorage.getItem('last-visit-date')
    const today = new Date().toDateString()
    
    if (lastVisit === today) {
      // Already visited today, keep the streak
      setStreak(savedStreak ? parseInt(savedStreak, 10) : 1)
    } else if (lastVisit) {
      const lastDate = new Date(lastVisit)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        const newStreak = (savedStreak ? parseInt(savedStreak, 10) : 0) + 1
        setStreak(newStreak)
        localStorage.setItem('learning-streak', newStreak.toString())
      } else {
        // Streak broken, reset to 1
        setStreak(1)
        localStorage.setItem('learning-streak', '1')
      }
    } else {
      // First visit ever
      setStreak(1)
      localStorage.setItem('learning-streak', '1')
    }
    
    localStorage.setItem('last-visit-date', today)
    
    setTimeout(() => setIsVisible(true), 800)
  }, [])

  const getStreakMessage = () => {
    if (streak >= 30) return "🏆 Legendary learner!"
    if (streak >= 14) return "🔥 You're on fire!"
    if (streak >= 7) return "⭐ Great consistency!"
    if (streak >= 3) return "💪 Keep it up!"
    return "🌱 Great start!"
  }

  const getFlameSize = () => {
    if (streak >= 30) return 'text-5xl'
    if (streak >= 14) return 'text-4xl'
    if (streak >= 7) return 'text-3xl'
    return 'text-2xl'
  }

  return (
    <div 
      className={`card p-6 text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className={`${getFlameSize()} animate-pulse`}>🔥</span>
        <div>
          <div className="text-4xl font-bold text-white">{streak}</div>
          <div className="text-sm text-navy-400">Day Streak</div>
        </div>
      </div>
      <p className="text-primary-400 font-medium">{getStreakMessage()}</p>
      
      {/* Streak milestones */}
      <div className="mt-4 flex justify-center gap-2">
        {[3, 7, 14, 30].map((milestone) => (
          <div
            key={milestone}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              streak >= milestone
                ? 'bg-primary-500 text-white'
                : 'bg-navy-800 text-navy-500'
            }`}
            title={`${milestone} day streak`}
          >
            {milestone}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickTip() {
  const [tip, setTip] = useState({ icon: '', text: '' })
  const [isVisible, setIsVisible] = useState(false)

  const tips = [
    { icon: '💡', text: 'Set a daily learning goal to stay consistent!' },
    { icon: '📝', text: 'Take notes while watching to retain more information.' },
    { icon: '🎯', text: 'Focus on one course at a time for better results.' },
    { icon: '⏰', text: 'Study in 25-minute focused sessions (Pomodoro).' },
    { icon: '🔄', text: 'Review previous lessons before starting new ones.' },
    { icon: '🤝', text: 'Join discussions to deepen your understanding.' },
    { icon: '💻', text: 'Practice code examples hands-on, not just reading.' },
    { icon: '🌙', text: 'Get enough sleep - it helps memory consolidation!' },
  ]

  useEffect(() => {
    // Select a random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)
    
    setTimeout(() => setIsVisible(true), 1200)
  }, [])

  return (
    <div 
      className={`card p-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{tip.icon}</div>
        <div>
          <h4 className="text-white font-semibold mb-1">Learning Tip</h4>
          <p className="text-navy-300 text-sm">{tip.text}</p>
        </div>
      </div>
    </div>
  )
}

export default function LearningStats({ 
  totalCourses, 
  totalLessons, 
  totalHours,
  totalInstructors 
}: LearningStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Stats Rings */}
      <div className="lg:col-span-2 card p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatRing
            value={totalCourses}
            maxValue={20}
            label="Courses"
            icon="📚"
            color="#6366f1"
            delay={0}
          />
          <StatRing
            value={totalLessons}
            maxValue={100}
            label="Lessons"
            icon="📖"
            color="#22c55e"
            delay={200}
          />
          <StatRing
            value={totalHours}
            maxValue={100}
            label="Hours"
            icon="⏱️"
            color="#f59e0b"
            delay={400}
          />
          <StatRing
            value={totalInstructors}
            maxValue={20}
            label="Experts"
            icon="👨‍🏫"
            color="#ec4899"
            delay={600}
          />
        </div>
        
        {/* Progress bar for total content */}
        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-navy-400">Platform Content</span>
            <span className="text-primary-400 font-medium">Growing Daily</span>
          </div>
          <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 via-green-500 to-yellow-500 rounded-full animate-pulse"
              style={{ width: '75%' }}
            />
          </div>
        </div>
      </div>
      
      {/* Right column - Streak and Tips */}
      <div className="space-y-6">
        <StreakCounter />
        <QuickTip />
      </div>
    </div>
  )
}