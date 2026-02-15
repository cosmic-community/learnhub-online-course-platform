'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  currentStreak: number
  longestStreak: number
  totalLessonsCompleted: number
  totalHoursLearned: number
  weeklyProgress: number[]
}

export default function LearningStreak() {
  const [stats, setStats] = useState<LearningStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalLessonsCompleted: 0,
    totalHoursLearned: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    } else {
      // Initialize with demo data for new users
      const demoStats: LearningStats = {
        currentStreak: 7,
        longestStreak: 14,
        totalLessonsCompleted: 23,
        totalHoursLearned: 18.5,
        weeklyProgress: [45, 30, 60, 90, 75, 100, 50],
      }
      setStats(demoStats)
      localStorage.setItem('learnhub-stats', JSON.stringify(demoStats))
    }
    
    // Trigger animation after mount
    setTimeout(() => setIsAnimating(true), 100)
  }, [])

  const incrementStreak = () => {
    const newStats = {
      ...stats,
      currentStreak: stats.currentStreak + 1,
      longestStreak: Math.max(stats.longestStreak, stats.currentStreak + 1),
      totalLessonsCompleted: stats.totalLessonsCompleted + 1,
      totalHoursLearned: stats.totalHoursLearned + 0.5,
    }
    setStats(newStats)
    localStorage.setItem('learnhub-stats', JSON.stringify(newStats))
    
    // Trigger celebration animation
    setIsAnimating(false)
    setTimeout(() => setIsAnimating(true), 50)
  }

  if (!mounted) {
    return (
      <div className="bg-gradient-to-br from-navy-900/80 to-navy-800/50 rounded-2xl p-6 border border-navy-700">
        <div className="animate-pulse">
          <div className="h-8 bg-navy-700 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-navy-700 rounded"></div>
        </div>
      </div>
    )
  }

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="bg-gradient-to-br from-navy-900/80 to-navy-800/50 rounded-2xl p-6 border border-navy-700 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stats.currentStreak > 0 && isAnimating && (
          <>
            <div className="absolute top-4 left-1/4 w-2 h-2 bg-orange-400/30 rounded-full animate-float-slow"></div>
            <div className="absolute top-8 right-1/3 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-12 left-1/3 w-2 h-2 bg-red-400/20 rounded-full animate-float-fast"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-orange-300/50 rounded-full animate-float-slow"></div>
          </>
        )}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Your Learning Journey
          </h3>
          <button
            onClick={incrementStreak}
            className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full hover:bg-primary-500/30 transition-colors"
          >
            + Log Lesson
          </button>
        </div>

        {/* Streak Display */}
        <div className="flex items-center gap-6 mb-6">
          {/* Fire Streak */}
          <div className="relative">
            <div className={`text-6xl transition-transform duration-500 ${isAnimating ? 'animate-bounce-gentle' : ''}`}>
              🔥
            </div>
            {stats.currentStreak >= 7 && (
              <div className="absolute -top-1 -right-1 text-lg animate-pulse">✨</div>
            )}
          </div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-transparent bg-clip-text transition-all duration-500 ${isAnimating ? 'scale-100' : 'scale-95'}`}>
                {stats.currentStreak}
              </span>
              <span className="text-navy-400 text-lg">day streak!</span>
            </div>
            <p className="text-navy-500 text-sm mt-1">
              {stats.currentStreak >= 7 
                ? "🎉 Amazing! Keep the momentum going!" 
                : stats.currentStreak >= 3 
                  ? "🌟 Great progress! Stay consistent!"
                  : "💪 Every day counts! Let's go!"}
            </p>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-navy-400">This Week's Activity</span>
            <span className="text-xs text-navy-500">Goal: 100% daily</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {stats.weeklyProgress.map((progress, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-navy-700/50 rounded-t-sm relative overflow-hidden h-14">
                  <div
                    className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-700 delay-${index * 100} ${
                      index === todayIndex 
                        ? 'bg-gradient-to-t from-primary-500 to-primary-400' 
                        : 'bg-gradient-to-t from-navy-600 to-navy-500'
                    }`}
                    style={{ 
                      height: `${progress}%`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                  {index === todayIndex && (
                    <div className="absolute inset-0 bg-primary-400/20 animate-pulse" />
                  )}
                </div>
                <span className={`text-xs ${index === todayIndex ? 'text-primary-400 font-semibold' : 'text-navy-500'}`}>
                  {dayNames[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-navy-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-lg font-bold text-white">{stats.longestStreak}</div>
            <div className="text-xs text-navy-400">Best Streak</div>
          </div>
          <div className="bg-navy-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-lg font-bold text-white">{stats.totalLessonsCompleted}</div>
            <div className="text-xs text-navy-400">Lessons Done</div>
          </div>
          <div className="bg-navy-800/50 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-lg font-bold text-white">{stats.totalHoursLearned}h</div>
            <div className="text-xs text-navy-400">Total Time</div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-6 pt-4 border-t border-navy-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-navy-400">Recent Achievements</span>
            <span className="text-xs text-primary-400 hover:text-primary-300 cursor-pointer">View All →</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AchievementBadge 
              icon="🌱" 
              title="First Steps" 
              unlocked={stats.totalLessonsCompleted >= 1}
              description="Complete your first lesson"
            />
            <AchievementBadge 
              icon="🔥" 
              title="On Fire" 
              unlocked={stats.currentStreak >= 3}
              description="3 day learning streak"
            />
            <AchievementBadge 
              icon="⚡" 
              title="Week Warrior" 
              unlocked={stats.currentStreak >= 7}
              description="7 day learning streak"
            />
            <AchievementBadge 
              icon="🎓" 
              title="Dedicated" 
              unlocked={stats.totalLessonsCompleted >= 10}
              description="Complete 10 lessons"
            />
            <AchievementBadge 
              icon="💎" 
              title="Scholar" 
              unlocked={stats.totalHoursLearned >= 10}
              description="10 hours of learning"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface AchievementBadgeProps {
  icon: string
  title: string
  unlocked: boolean
  description: string
}

function AchievementBadge({ icon, title, unlocked, description }: AchievementBadgeProps) {
  return (
    <div className="group relative">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
          unlocked 
            ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
            : 'bg-navy-800/50 border border-navy-700 grayscale opacity-50'
        }`}
      >
        {icon}
      </div>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border border-navy-700">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-navy-400">{description}</div>
        {!unlocked && <div className="text-navy-500 mt-1">🔒 Not yet unlocked</div>}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-800"></div>
      </div>
    </div>
  )
}