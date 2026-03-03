'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  coursesStarted: number
  lessonsCompleted: number
  currentStreak: number
  totalHours: number
  badges: Badge[]
}

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  earnedDate?: string
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-lesson', name: 'First Steps', icon: '🚀', description: 'Complete your first lesson', earned: true, earnedDate: '2024-01-15' },
  { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: '7-day learning streak', earned: true, earnedDate: '2024-01-22' },
  { id: 'night-owl', name: 'Night Owl', icon: '🦉', description: 'Study after midnight', earned: true, earnedDate: '2024-01-18' },
  { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Study before 6 AM', earned: false },
  { id: 'completionist', name: 'Completionist', icon: '🏆', description: 'Finish an entire course', earned: false },
  { id: 'speed-learner', name: 'Speed Learner', icon: '⚡', description: 'Complete 5 lessons in one day', earned: false },
]

const DAILY_TIPS = [
  { tip: "Break complex problems into smaller chunks - it's easier to solve a series of simple problems!", category: "Problem Solving", icon: "🧩" },
  { tip: "Write code comments for your future self. You'll thank yourself in 6 months!", category: "Best Practices", icon: "📝" },
  { tip: "Take a 5-minute break every 25 minutes (Pomodoro Technique) to stay focused.", category: "Productivity", icon: "🍅" },
  { tip: "Read error messages carefully - they often tell you exactly what's wrong!", category: "Debugging", icon: "🔍" },
  { tip: "Practice coding without looking up solutions first - struggle builds understanding.", category: "Learning", icon: "💪" },
  { tip: "Teach what you learn to someone else - it's the best way to solidify knowledge.", category: "Learning", icon: "👨‍🏫" },
  { tip: "Build projects, not just tutorials. Real learning happens when you create.", category: "Projects", icon: "🏗️" },
]

export default function LearningDashboard() {
  const [stats, setStats] = useState<LearningStats>({
    coursesStarted: 3,
    lessonsCompleted: 12,
    currentStreak: 5,
    totalHours: 24,
    badges: DEFAULT_BADGES,
  })
  const [dailyTip, setDailyTip] = useState(DAILY_TIPS[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAllBadges, setShowAllBadges] = useState(false)

  useEffect(() => {
    // Get daily tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(DAILY_TIPS[dayOfYear % DAILY_TIPS.length])
    
    // Trigger animation on mount
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const earnedBadges = stats.badges.filter(b => b.earned)
  const unearnedBadges = stats.badges.filter(b => !b.earned)

  return (
    <div className="card p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Your Learning Journey
          </h3>
          <p className="text-navy-400 text-sm mt-1">Keep up the great work!</p>
        </div>
        <div className={`text-4xl ${isAnimating ? 'animate-bounce' : ''}`}>
          🎯
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon="📚" 
          value={stats.coursesStarted} 
          label="Courses Started" 
          color="primary"
        />
        <StatCard 
          icon="✅" 
          value={stats.lessonsCompleted} 
          label="Lessons Done" 
          color="green"
        />
        <StatCard 
          icon="🔥" 
          value={stats.currentStreak} 
          label="Day Streak" 
          color="orange"
          highlight
        />
        <StatCard 
          icon="⏱️" 
          value={stats.totalHours} 
          label="Hours Learned" 
          color="purple"
        />
      </div>

      {/* Badges Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <span>🏅</span> Achievements
            <span className="text-sm text-navy-400">({earnedBadges.length}/{stats.badges.length})</span>
          </h4>
          <button
            onClick={() => setShowAllBadges(!showAllBadges)}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            {showAllBadges ? 'Show Less' : 'View All'}
          </button>
        </div>
        
        {/* Earned Badges */}
        <div className="flex flex-wrap gap-3 mb-4">
          {earnedBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-primary-500/10">
                {badge.icon}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-navy-700">
                <div className="font-semibold text-white">{badge.name}</div>
                <div className="text-navy-400 text-xs">{badge.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Unearned Badges (when expanded) */}
        {showAllBadges && unearnedBadges.length > 0 && (
          <div className="mt-4 pt-4 border-t border-navy-700">
            <p className="text-sm text-navy-400 mb-3">🔒 Locked Achievements</p>
            <div className="flex flex-wrap gap-3">
              {unearnedBadges.map((badge) => (
                <div key={badge.id} className="group relative">
                  <div className="w-14 h-14 rounded-xl bg-navy-800/50 border border-navy-700 flex items-center justify-center text-2xl opacity-40 grayscale">
                    {badge.icon}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-navy-800 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-navy-700">
                    <div className="font-semibold text-white">{badge.name}</div>
                    <div className="text-navy-400 text-xs">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Tip */}
      <div className="bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent rounded-xl p-5 border border-primary-500/20">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{dailyTip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-0.5 rounded-full">
                💡 Daily Tip
              </span>
              <span className="text-xs text-navy-500">{dailyTip.category}</span>
            </div>
            <p className="text-navy-200 text-sm leading-relaxed">{dailyTip.tip}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-navy-400">Weekly Goal Progress</span>
          <span className="text-white font-medium">5/7 days</span>
        </div>
        <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: '71%' }}
          />
        </div>
        <p className="text-xs text-navy-500 mt-2">Keep going! 2 more days to complete your weekly goal 🎯</p>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: string
  value: number
  label: string
  color: 'primary' | 'green' | 'orange' | 'purple'
  highlight?: boolean
}

function StatCard({ icon, value, label, color, highlight }: StatCardProps) {
  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  }

  return (
    <div className={`relative rounded-xl bg-gradient-to-br ${colorClasses[color]} border p-4 text-center overflow-hidden`}>
      {highlight && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 rounded-full blur-2xl -mr-4 -mt-4" />
      )}
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-navy-400">{label}</div>
    </div>
  )
}