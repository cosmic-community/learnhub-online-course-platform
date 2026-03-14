'use client'

import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
}

interface ProgressRingProps {
  progress: number
  size: number
  strokeWidth: number
  color: string
  label: string
  value: string
}

function ProgressRing({ progress, size, strokeWidth, color, label, value }: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-navy-400">{label}</span>
      </div>
    </div>
  )
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    const timer = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 300)
    return () => clearTimeout(timer)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

export default function LearningProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)

  // Simulated progress data (in a real app, this would come from user data)
  const progressData = {
    coursesCompleted: 3,
    totalCourses: 10,
    hoursLearned: 24,
    currentStreak: 7,
    lessonsThisWeek: 12,
    certificatesEarned: 2,
  }

  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', unlocked: true },
    { id: '2', name: 'Quick Learner', icon: '⚡', description: 'Complete 5 lessons in one day', unlocked: true },
    { id: '3', name: 'Dedicated', icon: '🔥', description: '7-day learning streak', unlocked: true },
    { id: '4', name: 'Explorer', icon: '🗺️', description: 'Try courses in 3 categories', unlocked: false },
    { id: '5', name: 'Master', icon: '🏆', description: 'Complete 10 courses', unlocked: false },
    { id: '6', name: 'Night Owl', icon: '🦉', description: 'Learn after midnight', unlocked: false },
  ]

  const motivationalQuotes = [
    "Every expert was once a beginner. Keep going! 🚀",
    "You're making progress every single day! 💪",
    "Learning is a journey, not a destination. 🌟",
    "Small steps lead to big achievements! 🎯",
  ]

  useEffect(() => {
    setIsVisible(true)
    // Animate streak counter
    const streakTimer = setInterval(() => {
      setStreak(prev => {
        if (prev < progressData.currentStreak) return prev + 1
        clearInterval(streakTimer)
        return prev
      })
    }, 150)

    // Show motivation message after animation
    const motivationTimer = setTimeout(() => {
      setShowMotivation(true)
    }, 2000)

    return () => {
      clearInterval(streakTimer)
      clearTimeout(motivationTimer)
    }
  }, [progressData.currentStreak])

  const completionPercentage = Math.round((progressData.coursesCompleted / progressData.totalCourses) * 100)

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Your Learning Journey</h2>
        <p className="text-navy-400">Track your progress and celebrate your achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Rings */}
        <div className="card p-8">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Progress Overview</h3>
          <div className="flex justify-around items-center">
            <ProgressRing
              progress={completionPercentage}
              size={100}
              strokeWidth={8}
              color="#22c55e"
              label="Complete"
              value={`${completionPercentage}%`}
            />
            <ProgressRing
              progress={70}
              size={100}
              strokeWidth={8}
              color="#3b82f6"
              label="This Week"
              value={`${progressData.lessonsThisWeek}`}
            />
            <ProgressRing
              progress={85}
              size={100}
              strokeWidth={8}
              color="#a855f7"
              label="Hours"
              value={`${progressData.hoursLearned}`}
            />
          </div>
        </div>

        {/* Streak Counter */}
        <div className="card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -mr-16 -mt-16" />
          <h3 className="text-lg font-semibold text-white mb-4">Learning Streak</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-6xl animate-bounce">🔥</div>
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {streak}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">
                <AnimatedCounter end={progressData.currentStreak} /> days
              </div>
              <p className="text-navy-400 text-sm">Keep it up! You&apos;re on fire!</p>
            </div>
          </div>
          
          {/* Weekly Activity */}
          <div className="mt-6 flex gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex-1 text-center">
                <div 
                  className={`h-8 rounded-sm mb-1 transition-all duration-500 ${
                    i < 5 ? 'bg-green-500/80' : i === 5 ? 'bg-green-500/40' : 'bg-navy-700'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
                <span className="text-xs text-navy-500">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
            <span className="text-sm text-navy-400">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'hover:scale-110' 
                    : 'opacity-40 grayscale'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`
                  w-full aspect-square rounded-xl flex items-center justify-center text-2xl
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30' 
                    : 'bg-navy-800 border border-navy-700'
                  }
                `}>
                  {achievement.icon}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-navy-700">
                  <div className="font-semibold">{achievement.name}</div>
                  <div className="text-navy-400">{achievement.description}</div>
                </div>
                {achievement.unlocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className={`mt-8 text-center transition-all duration-500 ${showMotivation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 rounded-full">
          <span className="text-2xl">✨</span>
          <span className="text-navy-200">{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</span>
        </div>
      </div>
    </div>
  )
}