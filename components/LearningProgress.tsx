'use client'

import { useState, useEffect } from 'react'

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
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
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
        </div>
      </div>
      <span className="mt-3 text-sm text-navy-400 text-center">{label}</span>
    </div>
  )
}

interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  progress?: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  index: number
}

function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 150)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`
        relative group cursor-pointer transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
          transition-all duration-300 group-hover:scale-110
          ${achievement.unlocked
            ? 'bg-gradient-to-br from-primary-500/30 to-primary-600/20 border border-primary-500/40 shadow-lg shadow-primary-500/20'
            : 'bg-navy-800/50 border border-navy-700/50 grayscale opacity-50'
          }
        `}
      >
        {achievement.icon}
        {achievement.unlocked && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-navy-700">
        <p className="text-sm font-medium text-white">{achievement.title}</p>
        <p className="text-xs text-navy-400">{achievement.description}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
      </div>
    </div>
  )
}

interface LearningProgressProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

export default function LearningProgress({ totalCourses, totalLessons, totalHours }: LearningProgressProps) {
  const [streakDays, setStreakDays] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Simulate loading streak from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('learning-streak')
    if (savedStreak) {
      setStreakDays(parseInt(savedStreak, 10))
    } else {
      // Demo: start with a random streak
      const demoStreak = Math.floor(Math.random() * 7) + 1
      setStreakDays(demoStreak)
      localStorage.setItem('learning-streak', demoStreak.toString())
    }
  }, [])

  // Confetti effect on milestone
  useEffect(() => {
    if (streakDays >= 7) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [streakDays])

  const achievements: Achievement[] = [
    { id: '1', icon: '🚀', title: 'Quick Start', description: 'View your first course', unlocked: true },
    { id: '2', icon: '📚', title: 'Bookworm', description: 'Browse 5 courses', unlocked: true },
    { id: '3', icon: '🔥', title: 'On Fire', description: '3-day learning streak', unlocked: streakDays >= 3 },
    { id: '4', icon: '🏆', title: 'Champion', description: '7-day learning streak', unlocked: streakDays >= 7 },
    { id: '5', icon: '🎯', title: 'Focused', description: 'Complete a lesson', unlocked: false },
    { id: '6', icon: '⭐', title: 'Star Student', description: 'Complete a course', unlocked: false },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const achievementProgress = (unlockedCount / achievements.length) * 100

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-navy-950" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl" />
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#14b8a6', '#2dd4bf', '#5eead4', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-primary-400 text-sm font-medium">Your Learning Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Track Your Progress
          </h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Every step counts! Keep learning and unlock achievements as you grow your skills.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <ProgressRing
            progress={Math.min((totalCourses / 10) * 100, 100)}
            size={120}
            strokeWidth={8}
            color="#14b8a6"
            label="Courses Available"
            value={`${totalCourses}`}
          />
          <ProgressRing
            progress={Math.min((totalLessons / 50) * 100, 100)}
            size={120}
            strokeWidth={8}
            color="#2dd4bf"
            label="Total Lessons"
            value={`${totalLessons}`}
          />
          <ProgressRing
            progress={Math.min((totalHours / 100) * 100, 100)}
            size={120}
            strokeWidth={8}
            color="#5eead4"
            label="Hours of Content"
            value={`${totalHours}h`}
          />
          <div className="flex flex-col items-center">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              <div className={`
                absolute inset-0 rounded-full 
                ${streakDays >= 7 ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/20 animate-pulse' : 'bg-navy-800/50'}
                border ${streakDays >= 3 ? 'border-yellow-500/40' : 'border-navy-700'}
              `} />
              <div className="relative flex flex-col items-center">
                <span className="text-3xl mb-1">🔥</span>
                <span className="text-2xl font-bold text-white">{streakDays}</span>
              </div>
            </div>
            <span className="mt-3 text-sm text-navy-400 text-center">Day Streak</span>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Achievements</h3>
              <p className="text-navy-400 text-sm">{unlockedCount} of {achievements.length} unlocked</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>
              <span className="text-sm text-navy-400">{Math.round(achievementProgress)}%</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>

          {/* Motivational Message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl border border-primary-500/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="text-white font-medium mb-1">
                  {streakDays >= 7 
                    ? "You're on fire! 🔥 Amazing 7-day streak!"
                    : streakDays >= 3
                    ? "Great progress! Keep the momentum going!"
                    : "Start your learning journey today!"}
                </p>
                <p className="text-navy-400 text-sm">
                  {streakDays >= 7
                    ? "You've unlocked the Champion badge. You're in the top 10% of learners!"
                    : streakDays >= 3
                    ? `Just ${7 - streakDays} more days to unlock the Champion badge!`
                    : "Complete lessons daily to build your streak and unlock achievements."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}