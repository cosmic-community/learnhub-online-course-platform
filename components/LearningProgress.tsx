'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  coursesStarted: number
  lessonsCompleted: number
  totalHoursLearned: number
  currentStreak: number
  longestStreak: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'course-complete',
    title: 'Course Master',
    description: 'Complete your first course',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'hours-10',
    title: 'Dedicated Learner',
    description: 'Learn for 10+ hours',
    icon: '📚',
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Start courses in 3 different categories',
    icon: '🧭',
    unlocked: false
  }
]

function ProgressRing({ progress, size = 80, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{progress}%</span>
      </div>
    </div>
  )
}

function StreakFlame({ streak }: { streak: number }) {
  const flameSize = Math.min(streak * 4 + 24, 48)
  
  return (
    <div className="relative group cursor-pointer">
      <div 
        className="animate-pulse text-center transition-transform duration-300 group-hover:scale-110"
        style={{ fontSize: flameSize }}
      >
        🔥
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full">
        <div className="text-center">
          <span className="text-2xl font-bold text-white">{streak}</span>
          <span className="text-xs text-navy-400 block">day streak</span>
        </div>
      </div>
    </div>
  )
}

function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (achievement.unlocked) {
      const timer = setTimeout(() => {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)
      }, index * 150)
      return () => clearTimeout(timer)
    }
  }, [achievement.unlocked, index])

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ${
        achievement.unlocked 
          ? 'opacity-100' 
          : 'opacity-40 grayscale'
      } ${isAnimating ? 'scale-125' : 'hover:scale-110'}`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
        achievement.unlocked 
          ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 shadow-lg shadow-primary-500/10' 
          : 'bg-navy-800/50 border border-navy-700'
      }`}>
        {achievement.icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-navy-700">
        <div className="text-sm font-medium text-white">{achievement.title}</div>
        <div className="text-xs text-navy-400">{achievement.description}</div>
        {achievement.unlocked && (
          <div className="text-xs text-primary-400 mt-1">✓ Unlocked!</div>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800" />
      </div>
      
      {/* Unlocked glow effect */}
      {achievement.unlocked && (
        <div className="absolute inset-0 rounded-2xl bg-primary-500/20 blur-xl -z-10 animate-pulse" />
      )}
    </div>
  )
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>({
    coursesStarted: 3,
    lessonsCompleted: 12,
    totalHoursLearned: 8.5,
    currentStreak: 5,
    longestStreak: 12,
    achievements: defaultAchievements
  })

  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // Simulate a celebration for demo
    const timer = setTimeout(() => {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const overallProgress = Math.round((stats.lessonsCompleted / 31) * 100) // 31 total lessons from CMS

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full border border-primary-500/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-400 text-sm font-medium">Your Learning Journey</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Track Your Progress</h2>
            <p className="text-navy-400">Stay motivated with personalized learning stats and achievements</p>
          </div>

          {/* Main stats grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Streak Card */}
            <div className="card p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="mb-4">
                  <StreakFlame streak={stats.currentStreak} />
                </div>
                <div className="mt-8">
                  <p className="text-navy-400 text-sm mb-1">Longest Streak</p>
                  <p className="text-white font-semibold">{stats.longestStreak} days</p>
                </div>
              </div>
            </div>

            {/* Overall Progress Card */}
            <div className="card p-6 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex justify-center mb-4">
                  <ProgressRing progress={overallProgress} size={100} strokeWidth={10} />
                </div>
                <p className="text-white font-semibold mb-1">Overall Progress</p>
                <p className="text-navy-400 text-sm">{stats.lessonsCompleted} of 31 lessons completed</p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="card p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Courses Started</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    <span className="text-xl">📖</span> {stats.coursesStarted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Hours Learned</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    <span className="text-xl">⏱️</span> {stats.totalHoursLearned}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Achievements</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    <span className="text-xl">🏅</span> {stats.achievements.filter(a => a.unlocked).length}/{stats.achievements.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Achievements</h3>
                <p className="text-navy-400 text-sm">Unlock badges as you learn</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary-400">{stats.achievements.filter(a => a.unlocked).length}</span>
                <span className="text-navy-500">/{stats.achievements.length}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {stats.achievements.map((achievement, index) => (
                <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
              ))}
            </div>

            {/* Motivational message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl border border-primary-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💪</span>
                <div>
                  <p className="text-white font-medium">Keep going! You're doing great!</p>
                  <p className="text-navy-400 text-sm">Complete 2 more lessons to unlock your next achievement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}