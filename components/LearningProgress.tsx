'use client'

import { useState, useEffect } from 'react'

interface LearningStats {
  lessonsCompleted: number
  totalMinutesLearned: number
  currentStreak: number
  longestStreak: number
  lastLessonSlug?: string
  lastLessonTitle?: string
  lastCourseSlug?: string
  lastCourseTitle?: string
}

const defaultStats: LearningStats = {
  lessonsCompleted: 0,
  totalMinutesLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
}

export default function LearningProgress() {
  const [stats, setStats] = useState<LearningStats>(defaultStats)
  const [isVisible, setIsVisible] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [motivationalMessage, setMotivationalMessage] = useState('')

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('learnhub-progress')
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats) as LearningStats
        setStats(parsed)
        
        // Check and update streak
        const lastVisit = localStorage.getItem('learnhub-last-visit')
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastVisit === yesterday) {
          // Continue streak
          const newStreak = parsed.currentStreak + 1
          const updatedStats = {
            ...parsed,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, parsed.longestStreak)
          }
          setStats(updatedStats)
          localStorage.setItem('learnhub-progress', JSON.stringify(updatedStats))
        } else if (lastVisit !== today) {
          // Reset streak if more than 1 day gap
          const updatedStats = { ...parsed, currentStreak: 1 }
          setStats(updatedStats)
          localStorage.setItem('learnhub-progress', JSON.stringify(updatedStats))
        }
        
        localStorage.setItem('learnhub-last-visit', today)
      } catch {
        // Invalid data, use defaults
      }
    } else {
      // Initialize for new users
      localStorage.setItem('learnhub-progress', JSON.stringify({
        ...defaultStats,
        currentStreak: 1
      }))
      localStorage.setItem('learnhub-last-visit', new Date().toDateString())
      setStats({ ...defaultStats, currentStreak: 1 })
    }

    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 17) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }

    // Set motivational message based on progress
    const messages = [
      "Every expert was once a beginner. Keep going! 🚀",
      "You're building something amazing. One lesson at a time! 💪",
      "Knowledge compounds. Today's learning is tomorrow's superpower! ⚡",
      "The best time to learn was yesterday. The next best time is now! 🎯",
      "Small steps lead to big changes. Keep moving forward! 🌟"
    ]
    setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)])

    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const formatMinutes = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⭐'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number): string => {
    if (streak >= 30) return 'Legendary! 30+ day streak!'
    if (streak >= 14) return 'Amazing! 2 weeks strong!'
    if (streak >= 7) return 'One week streak! Keep it up!'
    if (streak >= 3) return 'Building momentum!'
    return 'Start your learning journey!'
  }

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50 border-primary-500/20">
        {/* Greeting Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-1">{greeting}, Learner! 👋</h3>
          <p className="text-navy-300 text-sm">{motivationalMessage}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Streak Card */}
          <div className="bg-navy-800/50 rounded-xl p-4 text-center relative overflow-hidden group hover:bg-navy-800/70 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
            <div className="relative">
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">
                {getStreakEmoji(stats.currentStreak)}
              </div>
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-xs text-navy-400">Day Streak</div>
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="bg-navy-800/50 rounded-xl p-4 text-center relative overflow-hidden group hover:bg-navy-800/70 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent" />
            <div className="relative">
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">📖</div>
              <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
              <div className="text-xs text-navy-400">Lessons Done</div>
            </div>
          </div>

          {/* Time Learned */}
          <div className="bg-navy-800/50 rounded-xl p-4 text-center relative overflow-hidden group hover:bg-navy-800/70 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
            <div className="relative">
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">⏱️</div>
              <div className="text-2xl font-bold text-white">{formatMinutes(stats.totalMinutesLearned)}</div>
              <div className="text-xs text-navy-400">Time Learned</div>
            </div>
          </div>

          {/* Best Streak */}
          <div className="bg-navy-800/50 rounded-xl p-4 text-center relative overflow-hidden group hover:bg-navy-800/70 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent" />
            <div className="relative">
              <div className="text-3xl mb-1 transform group-hover:scale-110 transition-transform">🏅</div>
              <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
              <div className="text-xs text-navy-400">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Streak Progress Bar */}
        <div className="bg-navy-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-navy-300">{getStreakMessage(stats.currentStreak)}</span>
            <span className="text-xs text-primary-400">{stats.currentStreak}/7 days</span>
          </div>
          <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((stats.currentStreak / 7) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                  day <= stats.currentStreak 
                    ? 'bg-primary-500 text-white scale-100' 
                    : 'bg-navy-700 text-navy-500 scale-90'
                }`}
              >
                {day <= stats.currentStreak ? '✓' : day}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Resume - Show if user has a last lesson */}
        {stats.lastLessonSlug && stats.lastCourseSlug && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/5 rounded-xl border border-primary-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-xl">
                  ▶️
                </div>
                <div>
                  <p className="text-xs text-primary-400 mb-0.5">Continue where you left off</p>
                  <p className="text-white font-medium text-sm">{stats.lastLessonTitle}</p>
                  <p className="text-navy-400 text-xs">{stats.lastCourseTitle}</p>
                </div>
              </div>
              <a
                href={`/courses/${stats.lastCourseSlug}/lessons/${stats.lastLessonSlug}`}
                className="btn-primary text-sm py-2 px-4"
              >
                Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}